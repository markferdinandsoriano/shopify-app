// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import { Shopify } from "@shopify/shopify-api";
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
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const totalProductCount = await shopify.api.rest.Product.count({
      session: session,
    });

    const queryString = `
    {
      products(first:10) {
        edges {
          cursor
          node {
            id
            title
            bodyHtml
            createdAt
            handle
            images (first:10) {
              edges {
                node {
                  id
                  url
                }
              }
            }
            productType
            publishedAt
            status
            tags
            templateSuffix
            title
            updatedAt
            variants (first:10){
              edges {
                node {
                  id
                  title
                  price
                  inventoryQuantity
                }
              }
            }
            vendor
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }`;

    const data = await graphQLclient.query({
      data: queryString,
    });

    const allProducts = await shopify.api.rest.Product.all({
      session: session,
    });

    const resultData = data?.body?.data?.products?.edges;
    const pageInfo = data?.body?.data?.products?.pageInfo;

    res.status(200).send({
      data: resultData,
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

app.post("/api/products/productVariants/updateVariants", async (_req, res) => {
  try {
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const locationsResult = await shopify.api.rest.Location.all({
      session: session,
    });

    const { variants } = _req?.body;

    const newVariants = variants?.edges?.map((items) => {
      return {
        id: items?.node?.id,
        title: items?.node.title,
        inventoryQuantity: items?.node?.inventoryQuantity,
        price: items?.node.price,
      };
    });

    const productVariantsQuery = `
    mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          id
          title
          price
        }
      }
    }
  `;

    const resultValue = newVariants.map(async (items) => {
      const productVariant = await graphQLclient.query({
        data: {
          query: productVariantsQuery,
          variables: {
            input: {
              id: items?.id,
              title: items?.title,
              price: items?.price,
            },
          },
        },
      });

      return productVariant;
    });

    console.log("resultValue", resultValue);

    res.status(200).send(resultValue);
  } catch (error) {
    res.send(error);
  }
});

app.patch("/api/products/variants/update", async (_req, res) => {
  const {
    id,
    title,
    description,
    vendor,
    handle,
    status,
    productType,
    totalInventory,
    images,
  } = _req?.body;

  const queryString = `
  mutation updateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        descriptionHtml
        productType
        handle
        status
        vendor
      }
    }
  }
  `;
  try {
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const resultValue = await graphQLclient.query({
      data: {
        query: queryString,
        variables: {
          input: {
            id,
            title,
            descriptionHtml: description,
            productType,
            handle,
            status: status?.toUpperCase(),
            vendor,
            // productType,
            // totalInventory,
            // images,
          },
        },
      },
    });

    res.status(200)?.send(resultValue);
  } catch (error) {
    console.log("errrors", error);
    res.send(error);
  }
});

app.get("/api/product/search/:title", async (_req, res) => {
  try {
    const title = _req?.params?.title;
    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const queryString = `
      {
        products(first: 10, query: "title:${title}*") {
          edges {
            node {
              id
              title
              bodyHtml
              createdAt
              handle
              images (first:10) {
                edges {
                  node {
                    id
                    url
                  }
                }
              }
              productType
              publishedAt
              status
              tags
              templateSuffix
              title
              updatedAt
              variants (first:10){
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                  }
                }
              }
              vendor
            }
          }
        }
      }
      `;

    const data = await graphQLclient.query({
      data: queryString,
    });

    const newdatas = data?.body?.data?.products?.edges;

    res.status(200)?.send(newdatas);
  } catch (error) {
    console.log("errrors", error);
    res.send(error);
  }
});

app.post("/api/products/paginate", async (_req, res) => {
  try {
    const body = _req?.body;

    console.log("bodysss", body);

    const limit = body?.limit;
    const page = body?.page;
    const startCursor = body?.startCursor ? body?.startCursor : null;
    const endCursor = body?.endCursor ? body?.endCursor : null;
    const cursorValue = (page === 1 ? startCursor : endCursor) || null;

    const session = res.locals.shopify.session;

    const graphQLclient = new shopify.api.clients.Graphql({ session });

    const totalProductCount = await shopify.api.rest.Product.count({
      session: session,
    });

    const queryString = `
    {
      products(first: ${limit}, after: "${cursorValue}") {
        edges {
          cursor
          node {
            id
            title
            bodyHtml
            createdAt
            handle
            images (first:10) {
              edges {
                node {
                  id
                  url
                }
              }
            }
            productType
            publishedAt
            status
            tags
            templateSuffix
            title
            updatedAt
            variants (first:10){
              edges {
                node {
                  id
                  title
                  price
                  inventoryQuantity
                }
              }
            }
            vendor
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }`;

    const data = await graphQLclient.query({
      data: queryString,
    });

    const resultData = data?.body?.data?.products?.edges;
    const pageInfo = data?.body?.data?.products?.pageInfo;

    res.status(200).send({
      data: resultData,
      pageInfo,
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

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
