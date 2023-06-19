import React from "react";
import useProductStateStore from "../../../store/product-update";
import { useAuthenticatedFetch } from "../../../hooks";

const ViewModel = () => {
  const fetch = useAuthenticatedFetch();
  const { handleModifyVariants, productData, handleVariantsNotSave } =
    useProductStateStore();
  const [editIndex, setEditIndex] = React.useState(-1);

  const handleEdit = React.useCallback((index) => {
    setEditIndex(index);
  }, []);

  const handleCancel = React.useCallback((index) => {
    setEditIndex(index);
    handleVariantsNotSave();
  }, []);

  const handleAccept = React.useCallback((index) => {
    setEditIndex(index);

    const variants = productData?.variants;
    const datas = JSON.stringify({
      variants: variants,
    });

    fetch("/api/products/productVariants/updateVariants", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: datas,
    });
  }, []);

  const handleChange = React.useCallback((name, value, index) => {
    handleModifyVariants({
      name,
      value,
      index,
    });
  }, []);

  console.log("productData", productData);

  return {
    editIndex,
    handleEdit,
    handleCancel,
    handleChange,
    handleAccept,
  };
};

export default ViewModel;
