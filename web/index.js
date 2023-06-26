// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express, { Router } from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import {
  PerProducts,
  ProductUpdate,
  // SearchProducts,
  ProductVariantsUpdate,
  AllCollections,
  GetAllProducts,
} from "./apiData/index.js";
import DbConnection from "./dbConnection.js";
import {
  AllProducts,
  SearchForProductsDb,
  PaginatedData,
} from "./CustomDb/index.js";
import { getTesting } from "./proxyRoutes.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const proxyRouter = Router();

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use(express.json());

getTesting(app, shopify);

DbConnection();

// tunneling(app, shopify);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.status(200).send(countData);
});

app.get("/api/products/all", async (_req, res) => {
  try {
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const { totalProductCount, data, allProducts } = await GetAllProducts(
      session,
      graphQLclient,
      shopify
    );

    const resultData = data?.body?.data?.products?.edges;
    const pageInfo = data?.body?.data?.products?.pageInfo;

    const dataResult = await AllProducts(allProducts);

    res.status(200).send({
      data: resultData,
      datas: dataResult,
      pageInfo,
      allProducts: allProducts?.data,
      productCount: totalProductCount,
    });
  } catch (e) {
    console.log("errorrs", e);
    res.send(e);
  }
});

app.get("/api/products/collections/all", async (_req, res) => {
  try {
    const session = res.locals.shopify.session;
    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const { collections, productsInCollectionValue } = await AllCollections(
      graphQLclient,
      shopify
    );

    res.status(200).send({
      collections,
      productsInCollectionValue:
        productsInCollectionValue.length > 0 ? productsInCollectionValue : [],
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/products/perProducts/:id", async (_req, res) => {
  try {
    const id = _req?.params?.id;
    const session = res.locals.shopify.session;
    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const data = await PerProducts(id, graphQLclient, shopify);

    console.log("data", data);

    res.status(200).send(data);
  } catch (e) {
    res.send(e);
  }
});

app.post("/api/products/productVariants/updateVariants", async (_req, res) => {
  try {
    const { variants } = _req?.body;
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const ProductVariantResult = await ProductVariantsUpdate(
      variants,
      graphQLclient,
      shopify
    );

    res.status(200).send(ProductVariantResult);
  } catch (error) {
    res.send(error);
  }
});

app.patch("/api/products/variants/update", async (_req, res) => {
  const reqDatas = _req?.body;

  try {
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });
    const resultValue = await ProductUpdate(reqDatas, graphQLclient, shopify);

    res.status(200)?.send(resultValue);
  } catch (error) {
    console.log("variants updater error", error);
    res.send(error);
  }
});

app.get("/api/product/search/:title", async (_req, res) => {
  try {
    const title = _req?.params?.title;
    const datas = await SearchForProductsDb(title);

    res.status(200).send(datas);
  } catch (error) {
    console.log("search errrors", error);
    res.send(error);
  }
});

app.post("/api/products/paginate", async (_req, res) => {
  try {
    const body = _req?.body;

    const limit = body?.limit;
    const page = body?.page;
    const { documentData, counts } = await PaginatedData(limit, page);

    const session = res.locals.shopify.session;

    const totalProductCount = await shopify.api.rest.Product.count({
      session: session,
    });

    res.status(200).send({
      data: documentData,
      productCount: totalProductCount,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

proxyRouter.get("/", async (_req, res) => {
  res.status(200).send({ content: "Proxy Be Working" });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
