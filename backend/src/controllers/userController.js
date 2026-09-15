import mongoose from "mongoose";
import User from "../models/User.js";

/* ======================================================
   HELPERS
====================================================== */

const SAFE_USER_FIELDS =
  "-password -votingPassword -otp -otpExpiresAt -otpAttempts -refreshToken -refreshTokenExpiresAt -lastLoginIp";

const isValidObjectId = (id) => {
  return mongoose.isValidObjectId(id);
};

const getRequesterId = (req) => {
  return req.user?._id?.toString() || req.user?.id?.toString() || "";
};

/* ======================================================
   GET ALL USERS
   GET /api/users
====================================================== */

export const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      role,
      status,
    } = req.query;

    const filter = {};

    /* -----------------------------
       ROLE FILTER
    ----------------------------- */

    if (role) {
      const allowedRoles = ["user", "admin"];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid role. Allowed values are user or admin.",
        });
      }

      filter.role = role;
    }

    /* -----------------------------
       STATUS FILTER
    ----------------------------- */

    if (status) {
      const allowedStatuses = [
        "active",
        "blocked",
        "inactive",
        "verified",
        "unverified",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status filter.",
        });
      }

      if (status === "active") {
        filter.isActive = true;
        filter.isBlocked = false;
      }

      if (status === "blocked") {
        filter.isBlocked = true;
      }

      if (status === "inactive") {
        filter.isActive = false;
      }

      if (status === "verified") {
        filter.isVerified = true;
      }

      if (status === "unverified") {
        filter.isVerified = false;
      }
    }

    /* -----------------------------
       SEARCH
    ----------------------------- */

    if (search?.trim()) {
      const searchValue = search.trim();

      filter.$or = [
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          voterId: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    /* -----------------------------
       FETCH USERS
    ----------------------------- */

    const users = await User.find(filter)
      .select(SAFE_USER_FIELDS)
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "GET ALL USERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

/* ======================================================
   GET SINGLE USER
   GET /api/users/:id

   Admin only
====================================================== */

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(id)
      .select(SAFE_USER_FIELDS)
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "GET USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
    });
  }
};

/* ======================================================
   BLOCK / UNBLOCK USER
   PATCH /api/users/:id/status

   Admin only
====================================================== */

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* -----------------------------
       PREVENT SELF BLOCK
    ----------------------------- */

    if (
      user._id.toString() ===
      getRequesterId(req)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot block or disable your own admin account.",
      });
    }

    /* -----------------------------
       PREVENT BLOCKING ADMIN
    ----------------------------- */

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin accounts cannot be blocked through this endpoint.",
      });
    }

    /* -----------------------------
       TOGGLE STATUS
    ----------------------------- */

    user.isBlocked = !user.isBlocked;
    user.isActive = !user.isBlocked;

    /*
     * If blocked, invalidate refresh token.
     * This prevents future token refresh.
     */
    if (user.isBlocked) {
      user.refreshToken = null;
      user.refreshTokenExpiresAt = null;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully."
        : "User unblocked successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "TOGGLE USER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update user status.",
    });
  }
};

/* ======================================================
   DELETE USER
   DELETE /api/users/:id

   Admin only
====================================================== */

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /* -----------------------------
       PREVENT SELF DELETE
    ----------------------------- */

    if (
      user._id.toString() ===
      getRequesterId(req)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account.",
      });
    }

    /* -----------------------------
       PROTECT ADMIN ACCOUNTS
    ----------------------------- */

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin accounts cannot be deleted through this endpoint.",
      });
    }

    /* -----------------------------
       DELETE USER
    ----------------------------- */

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      deletedUserId: user._id,
    });
  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete user.",
    });
  }
};