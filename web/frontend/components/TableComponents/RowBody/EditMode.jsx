import React from "react";
import { TextField, Text } from "@shopify/polaris";

const EditMode = ({
  data,
  indexValue,
  editIndex,
  handleChange,
  type,
  title,
}) => {
  return (
    <>
      {indexValue === editIndex ? (
        <TextField
          autoComplete="off"
          value={data}
          onChange={handleChange}
          type={type}
          disabled={title === "Variants" || title === "Stocks" ? true : false}
          maxLength={type === "number" ? 4 : null}
        />
      ) : (
        <Text variant="headingMd" as="h6" fontWeight="regular">
          {data}
        </Text>
      )}
    </>
  );
};

export default EditMode;
