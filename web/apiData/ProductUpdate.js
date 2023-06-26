const ProductUpdate = async (reqDatas, graphQLclient, shopify) => {
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

  const resultValue = await graphQLclient.query({
    data: {
      query: queryString,
      variables: {
        input: {
          id: reqDatas?.id,
          title: reqDatas?.title,
          descriptionHtml: reqDatas?.description,
          productType: reqDatas?.productType,
          handle: reqDatas?.handle,
          status: reqDatas?.status?.toUpperCase(),
          vendor: reqDatas?.vendor,
        },
      },
    },
  });

  return resultValue;
};

export default ProductUpdate;
