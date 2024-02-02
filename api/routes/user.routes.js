import express from "express";
import { test, test2, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "backend homepage",
  });
});

router.get("/test", test);

router.get("/test2", test2);

router.post("/update/:id", verifyUser, updateUser);

export default router;
