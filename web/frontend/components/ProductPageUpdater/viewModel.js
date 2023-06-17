import React from "react";
import { useAppQuery } from "../../hooks";
import getNestedObject from "../../utils/getNestedObjects";
import useProductStateStore from "../../store/product-update";

const ViewModel = () => {
  const {
    productData,
    statusOptions,
    selectedProduct,
    collectionOptions,
    collectionTitleValue,
    productsInCollections,
    openModal,
    handleGetCollectionTitleValue,
    handleGetProductValue,
    handleChangeProductDataValue,
    handleSetOpenModal,
    handleOpenProductVariant,
  } = useProductStateStore();

  const productId = React.useRef(null);
  const collectionTitleRef = React.useRef(false);
  const productDataRef = React.useRef(false);

  productId.current = selectedProduct?.id;

  const { data, isLoading } = useAppQuery({
    url: `/api/products/perProducts/${productId?.current}`,
  });

  productDataRef.current = getNestedObject(data, ["body", "data", "product"]);

  React.useEffect(() => {
    if (productDataRef.current) {
      handleGetProductValue(productDataRef?.current);
    }
  }, [productDataRef.current]);

  const collectionTitleResult = productsInCollections?.find((items) => {
    const newItemsArr = Object.values(items)?.[0].map((items) => items.id);
    const result = newItemsArr.includes(productId.current);
    return result;
  });

  const collectionTitleOfProduct = collectionTitleResult
    ? Object.keys(collectionTitleResult)?.[0]
    : "";

  collectionTitleRef.current = collectionTitleOfProduct;

  const checkIfVariantsMoreThanTwo =
    getNestedObject(data, ["body", "data", "product", "variants", "edges"])
      ?.length > 1
      ? true
      : false;

  React.useEffect(() => {
    if (collectionTitleRef?.current) {
      handleGetCollectionTitleValue(collectionTitleRef.current);
    }
  }, [collectionTitleRef.current]);

  const handleStatusChange = React.useCallback((value, name) => {
    handleChangeProductDataValue({
      name,
      value,
    });
  }, []);
  const handleCollectionsChange = React.useCallback((value) => {
    handleGetCollectionTitleValue(value);
  }, []);

  const handleFormChange = React.useCallback((value, name) => {
    handleChangeProductDataValue({
      name,
      value,
    });
  }, []);

  const handleClose = React.useCallback(() => {
    handleSetOpenModal(false);
    handleGetProductValue(productDataRef?.current);
  });

  const handleOpenVariants = React.useCallback(() => {
    handleOpenProductVariant(true);
  }, []);

  console.log("productData", productData);

  return {
    data: productData,
    isLoading,
    statusOptions,
    collectionOptions,
    collectionTitleValue: collectionTitleValue?.toLowerCase(),
    checkIfVariantsMoreThanTwo,
    variantsLength: getNestedObject(data, [
      "body",
      "data",
      "product",
      "variants",
      "edges",
    ])?.length,
    openModal,
    handleStatusChange,
    handleCollectionsChange,
    handleFormChange,
    handleClose,
    handleOpenVariants,
  };
};

export default ViewModel;
