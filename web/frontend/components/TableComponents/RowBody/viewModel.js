import React from "react";
import useProductStateStore from "../../../store/product-update";
import { useAuthenticatedFetch } from "../../../hooks";

const ViewModel = () => {
  const fetch = useAuthenticatedFetch();
  const {
    handleModifyVariants,
    productData,
    handleVariantsNotSave,
    handleOpenToast,
  } = useProductStateStore();
  const [editIndex, setEditIndex] = React.useState(-1);

  const handleEdit = React.useCallback((index) => {
    setEditIndex(index);
  }, []);

  const handleCancel = React.useCallback((index) => {
    setEditIndex(index);
    handleVariantsNotSave();
  }, []);

  const handleAccept = React.useCallback(async (index) => {
    setEditIndex(index);

    try {
      const variants = productData?.variants;
      const datas = JSON.stringify({
        variants: variants,
      });

      const result = await fetch(
        "/api/products/productVariants/updateVariants",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: datas,
        }
      );

      if (result.status === 200) {
        handleOpenToast({
          message: "Data Successfully Updated",
          isOpen: true,
        });
      }
    } catch (error) {
    } finally {
    }
  }, []);

  const handleChange = React.useCallback((name, value, index) => {
    handleModifyVariants({
      name,
      value,
      index,
    });
  }, []);

  return {
    editIndex,

    handleEdit,
    handleCancel,
    handleChange,
    handleAccept,
  };
};

export default ViewModel;
