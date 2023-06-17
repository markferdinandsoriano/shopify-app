import React from "react";
import { useAppQuery } from "../../hooks";
import getNestedObject from "../../utils/getNestedObjects";
import useProductStateStore from "../../store/product-update";

const ViewModel = () => {
  const {
    handleSelectedProduct,
    handleGetCollections,
    handleSetProductsInCollection,
    handleSetOpenModal,
  } = useProductStateStore();

  const collectionRef = React.useRef([]);
  const productCollectionRef = React.useRef([]);

  const { data, isLoading, refetch, isRefetching } = useAppQuery({
    url: "/api/products/all",
  });

  const { data: dataCollections } = useAppQuery({
    url: "/api/products/collections/all",
  });

  const collectionData = getNestedObject(dataCollections?.collections, [
    "body",
    "data",
    "collections",
    "edges",
  ]);

  collectionRef.current = collectionData;
  productCollectionRef.current = dataCollections?.productsInCollectionValue;

  // collections
  React.useEffect(() => {
    if (collectionRef?.current?.length > 0) {
      const newCollections = collectionRef.current?.map((items) => {
        return {
          ...items.node,
        };
      });

      handleGetCollections([...newCollections]);
    }
  }, [collectionRef.current]);

  // products in collections
  React.useEffect(() => {
    if (productCollectionRef?.current?.length > 0) {
      handleSetProductsInCollection([...productCollectionRef.current]);
    }
  }, [productCollectionRef.current]);

  const handleOpenModal = () => {
    handleSetOpenModal(true);
  };

  const newData = data?.data;

  return {
    data: newData,
    isLoading,
    handleOpenModal,
    handleSelectedProduct,
  };
};

export default ViewModel;
