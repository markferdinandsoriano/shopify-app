const AllCollections = async (graphQLclient, shopify) => {
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

  return {
    collections,
    productsInCollectionValue,
  };
};

export default AllCollections;
