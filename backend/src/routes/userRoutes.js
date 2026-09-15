import express from "express";

import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import auditMiddleware from "../middleware/auditMiddleware.js";

const router = express.Router();

/* =========================================================
   GET ALL USERS
   GET /api/users

   Admin only
========================================================= */

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

/* =========================================================
   GET SINGLE USER
   GET /api/users/:id

   Admin only
========================================================= */

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getUserById
);

/* =========================================================
   BLOCK / UNBLOCK USER
   PATCH /api/users/:id/status

   Admin only + audit log
========================================================= */

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  toggleUserStatus
);

/* =========================================================
   DELETE USER
   DELETE /api/users/:id

   Admin only + audit log
========================================================= */

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  deleteUser
);

export default router;