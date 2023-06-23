import { Button, HorizontalStack } from "@shopify/polaris";
import {
  EditMajor,
  CancelMajor,
  MobileAcceptMajor,
} from "@shopify/polaris-icons";
import React from "react";
import getNestedObject from "../../../utils/getNestedObjects";
import EditMode from "./EditMode";

import ViewModel from "./viewModel";

import "./styles.css";

const RowComponent = ({ data, headers }) => {
  const model = ViewModel();

  const products = data;

  return (
    <tbody className="row-body">
      {products?.map((dataItems, index) => {
        return (
          <tr key={index} className="row-body-tr">
            {headers?.map((headerItems, idx = index) => {
              return (
                <td key={idx} align="center" className="row-body-td">
                  <HorizontalStack align="center">
                    {headerItems.title === "actions" ? (
                      <div style={{ display: "inline-flex", gap: "0.3em" }}>
                        {model?.editIndex === index && (
                          <Button
                            icon={MobileAcceptMajor}
                            onClick={() => model?.handleAccept(-1)}
                          />
                        )}
                        <Button
                          icon={
                            model?.editIndex === index ? CancelMajor : EditMajor
                          }
                          className="actions-icons"
                          onClick={() =>
                            model?.editIndex === index
                              ? model?.handleCancel(-1)
                              : model?.handleEdit(index)
                          }
                        />
                      </div>
                    ) : (
                      <EditMode
                        data={getNestedObject(dataItems, [
                          headerItems["accessor"],
                        ])}
                        type={getNestedObject(headerItems, ["type"])}
                        handleChange={(value) =>
                          model?.handleChange(
                            getNestedObject(headerItems, ["accessor"]),
                            value,
                            index
                          )
                        }
                        title={getNestedObject(headerItems, ["title"])}
                        indexValue={index}
                        editIndex={model?.editIndex}
                      />
                    )}
                  </HorizontalStack>
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
