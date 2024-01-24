import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
dotenv.config();

const app = express();

const PORT = 3000;

app.use("/api/user", userRouter);

mongoose
  .connect(process.env.DBConnect)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT} `);
});
