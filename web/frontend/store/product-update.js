import { create } from "zustand";

const useProductStateStore = create((set) => ({
  selectedProduct: {},
  productCopy: {},
  productData: {},
  openProductVariants: false,
  openModal: false,
  statusOptions: [
    {
      label: "Active",
      value: "Active",
    },
    {
      label: "Draft",
      value: "Draft",
    },
  ],
  collections: [],
  collectionOptions: [],
  collectionTitleValue: "",
  productsInCollections: [],
  handleSetOpenModal: (bool) => {
    set((state) => {
      return {
        ...state,
        openModal: bool,
      };
    });
  },
  handleSelectedProduct: (products) =>
    set((state) => {
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
        productCopy: {
          ...state.productCopy,
          ...datas,
        },
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
      };
    });
  },
}));

export default useProductStateStore;
