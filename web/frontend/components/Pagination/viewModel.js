import React from "react";
import { useAuthenticatedFetch } from "../../hooks";
import useProductStateStore from "../../store/product-update";

const ViewModel = () => {
  const { handleGetAllProducts, handleGetPageInfo, pageInfo, productCounts } =
    useProductStateStore();

  const fetch = useAuthenticatedFetch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(10);
  const [currentPageInfo, setCurrentPageInfo] = React.useState({});

  const totalPages = 10;
  const siblings = 1;

  const handlePageChange = React.useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleSelectedLimit = React.useCallback((value) => {
    setCurrentLimit(value);
  }, []);

  React.useEffect(() => {
    if (!!pageInfo) {
      setCurrentPageInfo(pageInfo);
    }
  }, [pageInfo]);

  const handlePagination = React.useCallback(async () => {
    const pageData = JSON.stringify({
      page: currentPage,
      limit: Number(currentLimit),
      endCursor: pageInfo?.endCursor,
      startCursor: pageInfo?.startCursor,
    });
    const result = await fetch("/api/products/paginate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: pageData,
    });
    const resultValue = await result.json();

    console.log("resultValue", resultValue);

    const newData = resultValue?.data?.map((items) => {
      return {
        ...items.node,
      };
    });
    handleGetAllProducts(newData);
    handleGetPageInfo(resultValue?.pageInfo);
  }, [currentPage, currentLimit]);

  React.useEffect(() => {
    handlePagination();
  }, [handlePagination]);

  return {
    handlePageChange,
    totalPages: productCounts,
    siblings,
    currentPage,
    handleSelectedLimit,
    pageInfo,
    currentLimit,
  };
};

export default ViewModel;
