import React from "react";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
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
    loadingSelectedProduct,
    handleGetCollectionTitleValue,
    handleGetProductValue,
    handleChangeProductDataValue,
    handleSetOpenModal,
    handleOpenProductVariant,
    handleProductUpdated,
    isUpdated,
  } = useProductStateStore();

  const fetch = useAuthenticatedFetch();

  const productId = React.useRef(null);
  const collectionTitleRef = React.useRef(false);
  const productDataRef = React.useRef(false);

  productId.current = selectedProduct?.id;

  const collectionTitleResult = productsInCollections?.find((items) => {
    const newItemsArr = Object.values(items)?.[0].map((items) => items.id);
    const result = newItemsArr.includes(productId.current);
    return result;
  });

  const collectionTitleOfProduct = collectionTitleResult
    ? Object.keys(collectionTitleResult)?.[0]
    : "";

  collectionTitleRef.current = collectionTitleOfProduct;

  const productDatalength = getNestedObject(productData, [
    "variants",
    "edges",
  ])?.length;

  const checkIfVariantsMoreThanTwo = productDatalength > 1 ? true : false;

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

  const handleUpdateProduct = async () => {
    const productToUpdate = JSON.stringify(productData);
    try {
      const results = await fetch("/api/products/variants/update", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: productToUpdate,
      });

      if (results?.status === 200) {
        handleProductUpdated(true);
      }
    } catch (error) {
      handleProductUpdated(false);
    } finally {
      setTimeout(() => {
        handleProductUpdated(false);
      }, 2000);
    }
  };

  return {
    data: productData,
    isLoading: loadingSelectedProduct,
    statusOptions,
    collectionOptions,
    collectionTitleValue: collectionTitleValue?.toLowerCase(),
    checkIfVariantsMoreThanTwo,
    variantsLength: productDatalength,
    openModal,
    isUpdated,
    handleStatusChange,
    handleCollectionsChange,
    handleFormChange,
    handleClose,
    handleOpenVariants,
    handleUpdateProduct,
  };
};

export default ViewModel;
