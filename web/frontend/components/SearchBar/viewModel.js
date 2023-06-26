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

  const deselectedOptions = autoCompleteData;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

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
    try {
      const result = await fetch(`/api/product/search/${searchDebounce}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        params: searchDebounce,
      });

      console.log("resultss", result);

      const resultValue = await result?.json();

      console.log("handle search error", resultValue);

      handleGetAllProducts(resultValue);
    } catch (error) {
      console.log("search fetch error", error);
    }
  };

  const handleFetchAll = async () => {
    const resultValue = await fetch("/api/products/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const newResult = await resultValue?.json();
    const newData = newResult?.datas;

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
