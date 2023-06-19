import { create } from "zustand";

const useProductStateStore = create((set) => ({
  selectedProduct: {},
  allProducts: [],
  autoCompleteData: [],
  productCopy: {},
  productData: {},
  loadingSelectedProduct: false,
  pageInfo: {},
  prevPageInfo: {},
  openProductVariants: false,
  openModal: false,
  productCounts: 0,
  statusOptions: [
    {
      label: "Active",
      value: "ACTIVE",
    },
    {
      label: "Draft",
      value: "DRAFT",
    },
  ],
  collections: [],
  collectionOptions: [],
  collectionTitleValue: "",
  productsInCollections: [],
  handleGetProductCounts: (count) => {
    set((state) => {
      return {
        ...state,
        productCounts: count,
      };
    });
  },
  handleSetLoadingSelectedProduct: (bool) => {
    set((state) => {
      return {
        ...state,
        loadingSelectedProduct: bool,
      };
    });
  },
  handleSetOpenModal: (bool) => {
    set((state) => {
      return {
        ...state,
        openModal: bool,
      };
    });
  },
  handleGetAllProducts: (data) => {
    set((state) => {
      return {
        ...state,
        allProducts: data,
      };
    });
  },
  handleAutoCompleteData: (data) => {
    set((state) => {
      return {
        ...state,
        autoCompleteData: data,
      };
    });
  },
  handleGetPageInfo: (info) => {
    set((state) => {
      return {
        ...state,
        pageInfo: info,
      };
    });
  },
  handleSelectedProduct: (products) =>
    set((state) => {
      console.log("products selected", products);
      return {
        ...state,
        selectedProduct: products,
      };
    }),
  handleGetCollections: (collections) => {
    set((state) => {
      const newCollections = collections?.map((items) => {
        return {
          label: items?.title,
          value: items?.handle,
        };
      });

      return {
        ...state,
        collections: collections,
        collectionOptions: newCollections,
      };
    });
  },
  handleSetProductsInCollection: (productsCollection) => {
    set((state) => {
      return {
        ...state,
        productsInCollections: productsCollection,
      };
    });
  },
  handleGetCollectionTitleValue: (title) => {
    set((state) => {
      return {
        ...state,
        collectionTitleValue: title,
      };
    });
  },
  handleGetProductValue: (datas) => {
    set((state) => {
      return {
        ...state,
        productData: {
          ...state.productData,
          ...datas,
        },
        productCopy: JSON.parse(
          JSON.stringify({
            ...state.productCopy,
            ...datas,
          })
        ),
      };
    });
  },
  handleChangeProductDataValue: (formValue) => {
    set((state) => {
      return {
        ...state,
        productData: {
          ...state.productData,
          [formValue?.name]: formValue?.value,
        },
      };
    });
  },
  handleOpenProductVariant: (bool) => {
    set((state) => {
      return {
        ...state,
        openProductVariants: bool,
        openModal: !bool,
      };
    });
  },
  handleModifyVariants: (dataValue) => {
    set((state) => {
      const accessNodes = structuredClone(
        state?.productData?.variants?.edges?.map((items) => {
          return {
            ...items.node,
          };
        })
      );

      const accessIndexData = accessNodes[dataValue.index];
      const copyData = {
        ...accessIndexData,
        [dataValue?.["name"]]: dataValue?.["value"],
      };

      const newNodesArr = state?.productData?.variants;
      newNodesArr["edges"][dataValue?.index]["node"] = copyData;

      return {
        ...state,
        productData: {
          ...state.productData,
          variants: newNodesArr,
        },
      };
    });
  },
  handleVariantsNotSave: () => {
    set((state) => {
      return {
        ...state,
        productData: structuredClone(state?.productCopy),
        productCopy: structuredClone(state?.productCopy),
      };
    });
  },
}));

export default useProductStateStore;
