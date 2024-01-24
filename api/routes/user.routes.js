import express from "express";
import { test, test2 } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "backend homepage",
  });
});

router.get("/test", test);

router.get("/test2", test2);

export default router;
