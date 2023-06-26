import { Products } from "../model.js";

const SearchForProductsDb = async (title) => {
  const result = await Products.find({ title: { $regex: `${title}` } }).limit(
    10
  );

  const unique = [
    ...new Map(result?.map((item) => [item?.title, item])).values(),
  ];

  return unique;
};

export default SearchForProductsDb;
