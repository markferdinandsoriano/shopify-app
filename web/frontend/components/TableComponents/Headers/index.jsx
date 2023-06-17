import React from "react";
import { headers } from "../../../utils/mockDatas";
import { Text } from "@shopify/polaris";

import "./styles.css";

const Headers = () => {
  return (
    <thead className="table-head">
      <tr>
        {headers?.map((items, index) => {
          return (
            <th key={index} align="center">
              <Text variant="headingLg" as="h4">
                {items?.title}
              </Text>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default Headers;
