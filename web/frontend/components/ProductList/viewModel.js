import React from "react";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import getNestedObject from "../../utils/getNestedObjects";
import useProductStateStore from "../../store/product-update";

const ViewModel = () => {
  const {
    handleSelectedProduct,
    handleGetCollections,
    handleSetProductsInCollection,
    handleSetOpenModal,
    handleGetAllProducts,
    allProducts,
    handleGetPageInfo,
    handleAutoCompleteData,
    handleGetProductValue,
    handleSetLoadingSelectedProduct,
    handleGetProductCounts,
    isUpdated,
  } = useProductStateStore();

  const fetch = useAuthenticatedFetch();

  const collectionRef = React.useRef([]);
  const productCollectionRef = React.useRef([]);
  const productsDataRef = React.useRef([]);

  const { data, isLoading, refetch, isRefetching } = useAppQuery({
    url: "/api/products/all",
    reactQueryOptions: {
      retry: true,
    },
  });

  productsDataRef.current = data;

  React.useEffect(() => {
    if (productsDataRef?.current) {
      const newData = productsDataRef?.current?.data?.map((items) => {
        return {
          ...items.node,
        };
      });

      const autoCompleteData = productsDataRef?.current?.allProducts?.map(
        (items) => {
          return {
            label: items?.title,
            value: items?.title,
          };
        }
      );

      handleGetAllProducts(newData);
      handleAutoCompleteData(autoCompleteData);
      handleGetPageInfo(productsDataRef.current?.pageInfo);
      handleGetProductCounts(productsDataRef?.current?.productCount?.count);
    }
  }, [productsDataRef?.current]);

  React.useEffect(() => {
    if (isUpdated) {
      refetch();
    }
  }, [isUpdated]);

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

  const handleOpenModal = React.useCallback(async (id) => {
    handleSetOpenModal(true);
    handleSetLoadingSelectedProduct(true);
    try {
      const stripID = id.replace("gid://shopify/Product/", "");
      const result = await fetch(`/api/products/perProducts/${stripID}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        params: stripID,
      });

      if (result?.status === 200) {
        handleSetLoadingSelectedProduct(false);
      }

      const jsonData = await result?.json();

      const resultData = getNestedObject(jsonData, ["body", "data", "product"]);

      handleGetProductValue(resultData);
    } catch (error) {
      handleSetLoadingSelectedProduct(true);
    } finally {
      handleSetLoadingSelectedProduct(false);
    }
  }, []);

  const fetchDatass = async () => {
    const result = await fetch("/api/testing/mongodb", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("resultss", result);
  };

  React.useEffect(() => {
    fetchDatass();
  }, []);

  const handleFetchSelectedProduct = React.useCallback(async (data) => {
    handleSelectedProduct(data);
  }, []);

  const newData = data?.data;

  return {
    data: allProducts,
    isLoading: isLoading || allProducts?.length === 0,
    handleOpenModal,
    handleFetchSelectedProduct,
  };
};

export default ViewModel;
