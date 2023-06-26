const GetAllProducts = async (session, graphQLclient, shopify) => {
  const totalProductCount = await shopify.api.rest.Product.count({
    session: session,
  });

  const queryString = `
  {
    products(first:30) {
      edges {
        cursor
        node {
          id
          title
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
          status
          tags
          title
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

  return {
    totalProductCount,
    data,
    allProducts,
  };
};

export default GetAllProducts;
