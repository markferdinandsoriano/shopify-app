import React from "react";
import { useAuthenticatedFetch } from "../../hooks";
import useProductStateStore from "../../store/product-update";

const ViewModel = () => {
  const { handleGetAllProducts, productCounts } = useProductStateStore();

  const fetch = useAuthenticatedFetch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(10);

  const siblings = 1;

  const handlePageChange = React.useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleSelectedLimit = React.useCallback((value) => {
    setCurrentLimit(value);
  }, []);

  const handlePagination = React.useCallback(async () => {
    const pageData = JSON.stringify({
      page: currentPage,
      limit: Number(currentLimit),
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

    const newData = resultValue?.data;
    console.log("newData", newData);
    handleGetAllProducts(newData);
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
    currentLimit,
  };
};

export default ViewModel;
