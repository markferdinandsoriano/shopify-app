import { Text } from "@shopify/polaris";
import React from "react";
import getNestedObject from "../../../utils/getNestedObjects";
import { products, headers } from "../../../utils/mockDatas";

import "./styles.css";

const RowComponent = () => {
  return (
    <tbody className="row-body">
      {products?.map((dataItems, index) => {
        return (
          <tr key={index} className="row-body-tr">
            {headers?.map((headerItems, idx = index) => {
              return (
                <td key={idx} align="center" className="row-body-td">
                  <Text variant="headingMd" as="p" fontWeight="regular">
                    {getNestedObject(dataItems, [headerItems["accessor"]])}
                  </Text>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default RowComponent;
