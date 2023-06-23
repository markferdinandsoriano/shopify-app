import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan";

const API_PORT = 3001;
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our MongoDB database
const dbRoute = `mongodb+srv://usernotuser:lighthouse@shopify-app.cfaoryt.mongodb.net/`;

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", () => console.log("connected to the database"));

app.get("testing/mongodb", (req, res) => {
  res.status(200).send({ content: "TESTING" });
});

// checks if connection with the database is successful

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
