import React from "react";
import { useAppQuery } from "../../hooks";

const ViewModel = () => {
  const { data, isLoading, refetch, isRefetching } = useAppQuery({
    url: "/api/products/all",
  });

  const newData = data?.data;

  return { data: newData, isLoading };
};

export default ViewModel;
