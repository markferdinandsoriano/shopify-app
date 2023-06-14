import React from "react";
import {
  ResourceList,
  Avatar,
  ResourceItem,
  MediaCard,
  Layout,
  EmptyState,
  Text,
  Spinner,
  HorizontalStack,
  Scrollable,
  VerticalStack,
} from "@shopify/polaris";

import ViewModel from "./viewModel";

const ProductList = () => {
  const model = ViewModel();

  console.log("model", model?.data);

  return (
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
                <MediaCard
                  key={id}
                  size="small"
                  title={title}
                  primaryAction={{
                    content: "Update Product",
                    onAction: () => {},
                  }}
                  description={
                    <VerticalStack gap="2">
                      <Text variant="headingSm" as="h6" color="subdued">
                        {vendor}
                      </Text>
                      <Text
                        variant="headingSm"
                        as="h6"
                        color={status !== "active" ? "critical" : "success"}
                      >
                        {status}
                      </Text>
                    </VerticalStack>
                  }
                >
                  <img
                    alt={`${title} image`}
                    width="100%"
                    height="200px"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src={`${image?.src}?width=300`}
                  />
                </MediaCard>
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
  );
};

export default ProductList;
