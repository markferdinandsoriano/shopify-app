import { Box, Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

// components
import SearchBar from "../components/SearchBar";
import Title from "../components/Title";
import ProductList from "../components/ProductList";

export default function PageIndex() {
  return (
    <Page fullWidth>
      <TitleBar title="Product Updater" primaryAction={null} />
      <Layout>
        <Box
          borderStyle="solid"
          borderColor="transparent"
          background="bg"
          width="95%"
          minHeight="90%"
          borderWidth="2"
          shadow="md"
          borderRadius="2"
        >
          <Title />
          <SearchBar />
          <ProductList />
        </Box>
      </Layout>
    </Page>
  );
}
