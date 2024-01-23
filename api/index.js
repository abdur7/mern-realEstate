import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.DBConnect)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));
const app = express();

const PORT = 3000;
app.get("/", (req, res) => {
  res.send("backend homepage");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} Port`);
});
