import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  id: "Mixed",
  title: "String",
  handle: "String",
  images: "Array",
  productType: "String",
  status: "String",
  tags: "Mixed",
  title: "String",
  variants: "Array",
  vendor: "String",
});

const Products = mongoose.model("products", productsSchema);

export { Products };
