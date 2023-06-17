// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

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

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.status(200).send(countData);
});

app.get("/api/products/all", async (_req, res) => {
  try {
    const allProductsData = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
    });

    res.status(200).send(allProductsData);
  } catch (e) {
    res.send(e);
  }
});

app.get("/api/products/collections/all", async (_req, res) => {
  try {
    const session = res.locals.shopify.session;
    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const queryString = `{
      collections(first: 10) {
        edges {
          node {
            id
            title
            description
            handle
            productsCount
          }
        }
      }
    }`;

    const collections = await graphQLclient.query({
      data: queryString,
    });

    let productsInCollectionValue = [];

    for (
      let i = 0;
      i < collections?.body?.data?.collections?.edges?.length;
      i++
    ) {
      const id = collections?.body?.data?.collections?.edges[i]?.["node"][
        "id"
      ].replace("gid://shopify/Collection/", "");

      const title =
        collections?.body?.data?.collections?.edges[i]?.["node"]?.["title"];

      const resultValue = await shopify.api.rest.Collection.products({
        session: session,
        id: id,
      });

      productsInCollectionValue.push(...[{ [title]: resultValue.products }]);
    }

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

    const queryString = `
    {
      product(id: "gid://shopify/Product/${id}") {
        id
        title
        description
        vendor
        handle
        variants(first:5) {
          edges {
            node {
              id
              title
              price
              inventoryQuantity
            }
          }
        }
        status
        description
        productType
        totalInventory
        images(first:5) {
          edges {
            node {
              id
              url
            }
          }
        }
      }
    }
    `;

    const data = await graphQLclient.query({
      data: queryString,
    });

    res.status(200).send(data);
  } catch (e) {
    res.send(e);
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

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
