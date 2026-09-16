import express from "express";

import {
  getAllUsers,
  getUserById,
  updateVoterVerification,
  toggleUserStatus,
  deleteUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import auditMiddleware from "../middleware/auditMiddleware.js";

const router = express.Router();

/* ======================================================
   ADMIN USER MANAGEMENT
====================================================== */

/*
GET /api/users
*/
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

/*
GET /api/users/:id
*/
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getUserById
);

/*
PATCH /api/users/:id/voter-verification

Body:
{
  "status": "VERIFIED"
}

or

{
  "status": "REJECTED"
}

or

{
  "status": "PENDING"
}
*/
router.patch(
  "/:id/voter-verification",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  updateVoterVerification
);

/*
PATCH /api/users/:id/status
*/
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  toggleUserStatus
);

/*
DELETE /api/users/:id
*/
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  auditMiddleware,
  deleteUser
);

export default router;