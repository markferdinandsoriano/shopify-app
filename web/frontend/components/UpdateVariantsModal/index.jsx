import React from "react";
import {
  Modal,
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
} from "@shopify/polaris";

import ViewModel from "./viewModel";

import Table from "../IndexedTable";

const UpdateVariantsModal = () => {
  const model = ViewModel();

  return (
    <Modal
      open={model?.openProductVariants}
      onClose={model?.handleClose}
      title={"Update Product Variants"}
      primaryAction={{
        content: "Save",
        onAction: () => {},
      }}
      secondaryActions={[
        {
          content: "Close",
          onAction: () => model?.handleClose,
        },
      ]}
    >
      <Modal.Section>
        <Table />
      </Modal.Section>
    </Modal>
  );
};

export default UpdateVariantsModal;
