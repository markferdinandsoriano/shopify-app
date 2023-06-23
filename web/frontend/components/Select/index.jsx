import { Select } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function SelectExample({ getSelectedValue }) {
  const [selected, setSelected] = useState(10);

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  useEffect(() => {
    getSelectedValue(selected);
  }, [selected]);

  const options = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "30", value: 30 },
  ];

  return (
    <div style={{ width: "auto" }}>
      <Select
        label="Show Limit"
        options={options}
        onChange={handleSelectChange}
        value={Number(selected)}
      />
    </div>
  );
}
