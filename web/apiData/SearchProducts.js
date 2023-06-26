const SearchProducts = async (title, graphQLclient, shopify) => {
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

  return data;
};

export default SearchProducts;
