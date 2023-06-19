import React from "react";
import { Modal, LegacyCard, Layout } from "@shopify/polaris";

import { headers, products } from "../../utils/mockDatas";

import ViewModel from "./viewModel";

import Table from "../IndexedTable";

import "./styles.css";

const UpdateVariantsModal = () => {
  const model = ViewModel();

  return (
    <Modal
      open={model?.openProductVariants}
      onClose={model?.handleClose}
      title={"Update Product Variants"}
      primaryAction={{
        content: "Close",
        onAction: () => model?.handleClose(),
      }}
    >
      <Modal.Section>
        <LegacyCard>
          <Layout>
            <Layout.Section>
              <Table headers={headers} data={model?.variants} />
            </Layout.Section>
          </Layout>
        </LegacyCard>
      </Modal.Section>
    </Modal>
  );
};

export default UpdateVariantsModal;
