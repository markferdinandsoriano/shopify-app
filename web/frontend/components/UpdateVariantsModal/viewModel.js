import React from "react";
import useProductStateStore from "../../store/product-update";

const ViewModel = () => {
  const { openProductVariants, handleOpenProductVariant } =
    useProductStateStore();

  const handleClose = React.useCallback(() => {
    handleOpenProductVariant(false);
  }, []);

  return { openProductVariants, handleClose };
};

export default ViewModel;
