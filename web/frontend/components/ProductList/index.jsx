import React from "react";
import {
  ResourceList,
  ResourceItem,
  MediaCard,
  Layout,
  EmptyState,
  Text,
  Spinner,
  Scrollable,
  VerticalStack,
} from "@shopify/polaris";

import ProductUpdaterModal from "../ProductPageUpdater";
import ViewModel from "./viewModel";

const ProductList = () => {
  const model = ViewModel();

  return (
    <>
      <Layout.Section>
        <Scrollable shadow style={{ height: "68vh" }} focusable>
          {model.isLoading ? (
            <Text alignment="center">
              <Spinner />
            </Text>
          ) : model?.data?.length > 0 ? (
            <ResourceList
              resourceName={{ singular: "product", plural: "products" }}
              items={model?.data}
              renderItem={(item) => {
                const { id, title, image, vendor, status } = item;

                return (
                  <ResourceItem
                    id={id}
                    accessibilityLabel={`View details for ${title}`}
                  >
                    <MediaCard
                      key={id}
                      size="small"
                      title={title}
                      primaryAction={{
                        content: "Update Product",
                        onAction: () => {
                          model.handleOpenModal();
                          model.handleSelectedProduct({
                            id,
                            title,
                            image,
                            vendor,
                            status,
                          });
                        },
                      }}
                      description={vendor}
                    >
                      <img
                        alt={`${title} image`}
                        width="100%"
                        height="200px"
                        loading="lazy"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={`${image?.src}?width=300`}
                      />
                    </MediaCard>
                  </ResourceItem>
                );
              }}
            />
          ) : (
            <EmptyState
              heading="Manage your inventory transfers"
              action={{ content: "Add transfer" }}
              secondaryAction={{
                content: "Learn more",
                url: "https://help.shopify.com",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Track and receive your incoming inventory from suppliers.</p>
            </EmptyState>
          )}
        </Scrollable>
      </Layout.Section>
      <ProductUpdaterModal />
    </>
  );
};

export default ProductList;
