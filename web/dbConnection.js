import mongoose from "mongoose";

const DbConnection = async () => {
  const dbRoute = `mongodb+srv://usernotuser:lighthouse@shopify-app.cfaoryt.mongodb.net/shopify-app`;

  // connects our back end code with the database
  await mongoose.connect(dbRoute, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  db.once("open", () => console.log("connected to the database"));

  return {
    db,
  };
};

export default DbConnection;
