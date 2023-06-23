import React from "react";
import { Modal, LegacyCard, Layout, Frame } from "@shopify/polaris";
import Toastcomponent from "../ToastMessage";
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
      <Frame>
        <Modal.Section>
          <LegacyCard>
            <Layout>
              <Layout.Section>
                <Table headers={headers} data={model?.variants} />
              </Layout.Section>
            </Layout>
          </LegacyCard>
        </Modal.Section>

        <Toastcomponent
          message={model?.toastMessage?.message}
          isOpen={model?.toastMessage?.isOpen}
        />
      </Frame>
    </Modal>
  );
};

export default UpdateVariantsModal;
