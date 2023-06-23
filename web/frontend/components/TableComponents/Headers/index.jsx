import React from "react";

import { Text } from "@shopify/polaris";

import "./styles.css";

const Headers = ({ headers }) => {
  return (
    <thead className="table-head">
      <tr className="thead-tr">
        {headers?.map((items, index) => {
          return (
            <th key={index} align="center">
              <Text variant="headingLg" as="h4">
                {items?.title === "actions" ? "" : items.title}
              </Text>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default Headers;
