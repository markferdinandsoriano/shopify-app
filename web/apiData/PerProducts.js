const PerProducts = async (id, graphQLclient, shopify) => {
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

  return data;
};

export default PerProducts;
