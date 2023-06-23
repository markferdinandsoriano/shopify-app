export const getTesting = async (app, shopify) => {
  try {
    app.get("/api/testing/mongodb", (_req, res) => {
      res.status(200).send({ sucess: true, message: "proxy working" });
    });
  } catch (error) {
    res.send(error);
  }
};
