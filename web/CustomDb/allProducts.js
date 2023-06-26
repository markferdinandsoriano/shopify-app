import { Products } from "../model.js";

const AllProducts = async (allDatas) => {
  const remapValue = allDatas?.data?.map((items) => {
    return { ...items };
  });

  const findProducts = Products.find();
  const countValue = await findProducts
    .count()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("count error", err);
    });

  if (countValue?.length === 0 && remapValue?.length > 0) {
    await Products.insertMany([...remapValue])
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log("db all products error", err);
      });

    return await Products.find({}).limit(10);
  } else {
    const allDatas = await Products.find({}).limit(10);
    return allDatas;
  }
};

export default AllProducts;
