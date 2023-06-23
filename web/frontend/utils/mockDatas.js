const headers = [
  {
    title: "Variants",
    accessor: "title",
    type: "text",
  },
  {
    title: "Price",
    accessor: "price",
    type: "number",
  },
  {
    title: "Stocks",
    accessor: "inventoryQuantity",
    type: "number",
  },
  {
    title: "actions",
    accessor: "components",
  },
];

const products = [
  {
    id: "gid://shopify/ProductVariant/45197953466668",
    inventoryQuantity: 59,
    price: "42.99",
    title: "Blue",
  },
  {
    id: "gid://shopify/ProductVariant/45197953499436",
    inventoryQuantity: 28,
    price: "62.99",
    title: "Black",
  },
];

export { headers, products };
