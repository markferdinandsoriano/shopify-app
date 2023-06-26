import { Products } from "../model.js";

const PaginatedData = async (limit, skip) => {
  const query = {};
  const newSkip = limit * skip;
  const pipeline = [
    { $match: query },
    { $skip: newSkip },
    { $limit: limit },
    {
      $facet: {
        documents: [{ $match: query }],
        count: [{ $count: "total" }],
      },
    },
  ];

  const paginationResult = await Products.aggregate(pipeline)
    .exec()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log("paginated error", err);
    });

  const documentData = paginationResult[0]?.documents;
  const counts = paginationResult[0]?.count?.[0]?.total;

  return {
    documentData,
    counts,
  };
};

export default PaginatedData;
