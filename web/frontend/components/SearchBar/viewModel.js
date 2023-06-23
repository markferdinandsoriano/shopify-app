import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import useProductStateStore from "../../store/product-update";
import { useAuthenticatedFetch, useAppQuery } from "../../hooks";
import useDebounce from "../../utils/useDebounce";

const ViewModel = () => {
  const fetch = useAuthenticatedFetch();
  const { autoCompleteData, handleGetAllProducts, handleGetProductCounts } =
    useProductStateStore();

  const deselectedOptions = useMemo(() => autoCompleteData, [autoCompleteData]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const searchedProducts = useRef([]);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || "");
    },
    [options]
  );

  const searchDebounce = useDebounce(inputValue, 1000);

  const handleFetchSearchedData = async () => {
    const result = await fetch(`/api/product/search/${searchDebounce}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      params: searchDebounce,
    });

    const resultValue = await result.json();
    const newData = resultValue?.map((items) => {
      return {
        ...items.node,
      };
    });

    console.log("resultValue", resultValue);
    handleGetAllProducts(newData);
  };

  const handleFetchAll = async () => {
    const resultValue = await fetch("/api/products/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const newResult = await resultValue.json();
    const newData = newResult?.data?.map((items) => {
      return {
        ...items.node,
      };
    });

    handleGetAllProducts(newData);
    handleGetProductCounts(newResult?.productCount?.count);
  };

  React.useEffect(() => {
    if (searchDebounce !== "") {
      handleFetchSearchedData();
    } else {
      handleFetchAll();
    }
  }, [searchDebounce]);

  return {
    updateSelection,
    options,
    selectedOptions,
    updateText,
    inputValue,
  };
};

export default ViewModel;
