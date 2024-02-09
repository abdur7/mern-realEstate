import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "backend homepage",
  });
});

router.post("/update/:id", verifyToken, updateUser);

router.delete("/delete/:id", verifyToken, deleteUser);

router.get("/listings/:id", verifyToken, getUserListings);

router.get("/:id", verifyToken, getUser);

export default router;
