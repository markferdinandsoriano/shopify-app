import React from "react";
import {
  Layout,
  Modal,
  TextField,
  Divider,
  FormLayout,
  HorizontalGrid,
  Select,
  Text,
  Button,
  VerticalStack,
} from "@shopify/polaris";
import SkeletonPageComponent from "../SkeletonPage";
import UpdateVariantsModal from "../UpdateVariantsModal";
import getNestedObject from "../../utils/getNestedObjects";
import { useNavigate } from "@shopify/app-bridge-react";

import Carousel from "../Carousel";
import ViewModel from "./viewModel";

import "./style.css";

const ProductUpdaterModal = () => {
  const model = ViewModel();

  const navigate = useNavigate();

  const images = getNestedObject(model, ["data", "images", "edges"]);

  return (
    <>
      <Modal
        open={model?.openModal}
        onClose={model?.handleClose}
        title={model.data?.["title"]}
        primaryAction={{
          content: "Update Product",
          onAction: () => model?.handleUpdateProduct(),
        }}
        secondaryActions={[
          {
            content: "View Product Admin",
            onAction: () =>
              navigate(
                {
                  name: "Product",
                  resource: {
                    id: model?.data?.id?.replace("gid://shopify/Product/", ""),
                  },
                },
                { target: "new" }
              ),
          },
        ]}
      >
        {model.isLoading ? (
          <SkeletonPageComponent />
        ) : (
          <Modal.Section>
            <Layout>
              <Layout.Section>
                <HorizontalGrid columns={2}>
                  <div className="image-carousel">
                    <Carousel data={images} />
                  </div>
                  <FormLayout>
                    <Select
                      label="Status"
                      options={model.statusOptions}
                      value={model?.data?.["status"]}
                      onChange={(value) =>
                        model?.handleStatusChange(value, "status")
                      }
                    />
                    <Select
                      label="Collections"
                      options={model.collectionOptions}
                      onChange={model?.handleCollectionsChange}
                      value={model?.collectionTitleValue}
                    />
                    <Button onClick={model?.handleOpenVariants}>
                      Change Variants
                    </Button>
                  </FormLayout>
                </HorizontalGrid>
              </Layout.Section>
              <Layout.Section>
                <Divider borderColor="border" />
              </Layout.Section>
              <Layout.Section>
                <FormLayout>
                  <TextField
                    label="Title"
                    type="text"
                    value={model?.data?.["title"]}
                    onChange={(value) =>
                      model?.handleFormChange(value, "title")
                    }
                    autoComplete="off"
                  />
                  <TextField
                    type="text"
                    label="Description"
                    value={model?.data?.["description"]}
                    onChange={(value) =>
                      model?.handleFormChange(value, "description")
                    }
                    autoComplete="off"
                  />

                  {model?.checkIfVariantsMoreThanTwo ? (
                    <VerticalStack gap="2">
                      <Text variant="headingMd" as="h6" fontWeight="regular">
                        Stocks
                      </Text>
                      <Text variant="headingSm" as="h6" fontWeight="regular">
                        {`${model?.data?.totalInventory} in stock for ${model?.variantsLength} variants`}
                      </Text>
                    </VerticalStack>
                  ) : (
                    <TextField
                      type="number"
                      label="Stocks"
                      value={model?.data?.totalInventory}
                      onChange={(value) =>
                        model?.handleFormChange(value, "totalInventory")
                      }
                      disabled
                      autoComplete="off"
                    />
                  )}

                  <TextField
                    type="text"
                    label="Product Type"
                    value={model?.data?.["productType"]}
                    onChange={(value) =>
                      model?.handleFormChange(value, "productType")
                    }
                    autoComplete="off"
                  />
                  <TextField
                    type="text"
                    label="Vendor"
                    value={model?.data?.["vendor"]}
                    onChange={(value) =>
                      model?.handleFormChange(value, "vendor")
                    }
                    autoComplete="off"
                  />
                </FormLayout>
              </Layout.Section>
            </Layout>
          </Modal.Section>
        )}
      </Modal>
      <UpdateVariantsModal />
      {model?.isUpdated && (
        <Modal open={model?.isUpdated}>
          <Modal.Section>
            <Text
              variant="heading4xl"
              as="h1"
              alignment="center"
              color="success"
            >
              <p>Product Updated</p>
            </Text>
          </Modal.Section>
        </Modal>
      )}
    </>
  );
};

export default ProductUpdaterModal;
