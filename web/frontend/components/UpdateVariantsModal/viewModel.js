import React from "react";
import useProductStateStore from "../../store/product-update";
import getNestedObject from "../../utils/getNestedObjects";

const ViewModel = () => {
  const {
    openProductVariants,
    handleOpenProductVariant,
    productData,
    toastMessage,
  } = useProductStateStore();

  const variants = getNestedObject(productData, ["variants", "edges"])?.map(
    (items) => {
      return {
        ...items?.node,
      };
    }
  );

  const handleClose = React.useCallback(() => {
    handleOpenProductVariant(false);
  }, []);

  const handleSave = React.useCallback(() => {
    handleOpenProductVariant(false);
  }, []);

  return {
    openProductVariants,
    toastMessage,
    variants,
    handleClose,
    handleSave,
  };
};

export default ViewModel;
