import {
  SkeletonPage,
  Layout,
  LegacyCard,
  SkeletonBodyText,
  VerticalStack,
  SkeletonDisplayText,
} from "@shopify/polaris";
import React from "react";

const SkeletonPageComponent = () => {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <SkeletonBodyText />
          </LegacyCard>
          <LegacyCard sectioned>
            <VerticalStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </VerticalStack>
          </LegacyCard>
          <LegacyCard sectioned>
            <VerticalStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </VerticalStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default SkeletonPageComponent;
