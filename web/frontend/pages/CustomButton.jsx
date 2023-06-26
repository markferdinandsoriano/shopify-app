import React from "react";
import { Banner, Layout, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

const CustomButton = () => {
  return (
    <Page>
      <TitleBar title="Custom Button" primaryAction={null} />
      <div>CustomButton</div>
    </Page>
  );
};

export default CustomButton;
