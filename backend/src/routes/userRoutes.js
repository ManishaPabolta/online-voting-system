import express from "express";

import {
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

export default router;