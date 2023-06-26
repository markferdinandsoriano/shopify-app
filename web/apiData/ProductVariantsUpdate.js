const ProductVariantsUpdate = async (variants, graphQLclient, shopify) => {
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

  let ProductVariantResult = [];

  for (let i = 0; i < newVariants.length; i++) {
    const productVariant = await graphQLclient.query({
      data: {
        query: productVariantsQuery,
        variables: {
          input: {
            id: newVariants?.[i]?.id,
            price: newVariants?.[i]?.price,
          },
        },
      },
    });

    ProductVariantResult.push(
      productVariant?.body?.data?.productVariantUpdate?.productVariant
    );
  }

  return ProductVariantResult;
};

export default ProductVariantsUpdate;
