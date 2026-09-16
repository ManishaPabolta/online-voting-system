import mongoose from "mongoose";
import User from "../models/User.js";
import VoterProfile from "../models/VoterProfile.js";

/* ======================================================
   HELPERS
====================================================== */

const SAFE_USER_FIELDS =
  "-password -votingPassword -otp -otpExpiresAt -otpAttempts -refreshToken -refreshTokenExpiresAt -lastLoginIp";

const isValidObjectId = (id) => {
  return mongoose.isValidObjectId(id);
};

const getRequesterId = (req) => {
  return (
    req.user?._id?.toString() ||
    req.user?.id?.toString() ||
    ""
  );
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
          message: "Invalid status filter.",
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

    /*
     * Fetch voter profiles separately.
     *
     * User verification and voter-profile
     * verification are different things.
     */

    const userIds = users.map((user) => user._id);

    const profiles = await VoterProfile.find({
      user: {
        $in: userIds,
      },
    })
      .select(
        "user name age gender address city state pincode phone voterId idProof profilePhoto isComplete isEligible verificationStatus verifiedAt createdAt updatedAt"
      )
      .lean();

    const profileMap = new Map();

    profiles.forEach((profile) => {
      profileMap.set(
        profile.user.toString(),
        profile
      );
    });

    const usersWithProfiles = users.map(
      (user) => {
        const profile =
          profileMap.get(
            user._id.toString()
          ) || null;

        return {
          ...user,

          voterProfile: profile,

          voterVerificationStatus:
            profile?.verificationStatus ||
            "NOT_SUBMITTED",

          voterEligible:
            profile?.isEligible === true,

          voterProfileComplete:
            profile?.isComplete === true,
        };
      }
    );

    return res.status(200).json({
      success: true,
      count: usersWithProfiles.length,
      users: usersWithProfiles,
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
====================================================== */

export const getUserById = async (
  req,
  res
) => {
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

    const voterProfile =
      await VoterProfile.findOne({
        user: id,
      })
        .select(
          "user name age gender address city state pincode phone voterId idProof profilePhoto isComplete isEligible verificationStatus verifiedAt createdAt updatedAt"
        )
        .lean();

    return res.status(200).json({
      success: true,

      user: {
        ...user,

        voterProfile:
          voterProfile || null,

        voterVerificationStatus:
          voterProfile?.verificationStatus ||
          "NOT_SUBMITTED",

        voterEligible:
          voterProfile?.isEligible === true,

        voterProfileComplete:
          voterProfile?.isComplete === true,
      },
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
   VERIFY / REJECT VOTER PROFILE
   PATCH /api/users/:id/voter-verification
====================================================== */

export const updateVoterVerification =
  async (req, res) => {
    try {
      const { id } = req.params;

      const requestedStatus =
        String(
          req.body?.status || ""
        )
          .trim()
          .toUpperCase();

      /* -----------------------------
         VALIDATE USER ID
      ----------------------------- */

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      /* -----------------------------
         VALIDATE STATUS
      ----------------------------- */

      const allowedStatuses = [
        "PENDING",
        "VERIFIED",
        "REJECTED",
      ];

      if (
        !allowedStatuses.includes(
          requestedStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid verification status. Allowed values are PENDING, VERIFIED or REJECTED.",
        });
      }

      /* -----------------------------
         FIND USER
      ----------------------------- */

      const user =
        await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      /* -----------------------------
         ADMIN ACCOUNT PROTECTION
      ----------------------------- */

      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Admin accounts cannot be verified as voters.",
        });
      }

      /* -----------------------------
         FIND VOTER PROFILE
      ----------------------------- */

      const profile =
        await VoterProfile.findOne({
          user: id,
        });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Voter profile has not been submitted by this user.",
          profileRequired: true,
        });
      }

      /* -----------------------------
         PROFILE COMPLETENESS
      ----------------------------- */

      if (
        requestedStatus === "VERIFIED"
      ) {
        if (
          profile.isComplete !== true
        ) {
          return res.status(400).json({
            success: false,
            message:
              "This voter profile is incomplete and cannot be verified.",
          });
        }
      }

      /* -----------------------------
         UPDATE VERIFICATION
      ----------------------------- */

      profile.verificationStatus =
        requestedStatus;

      if (
        requestedStatus === "VERIFIED"
      ) {
        profile.isEligible = true;
        profile.verifiedAt =
          new Date();
      } else {
        profile.isEligible = false;
        profile.verifiedAt = null;
      }

      await profile.save();

      /* -----------------------------
         RESPONSE
      ----------------------------- */

      let message =
        "Voter profile status updated successfully.";

      if (
        requestedStatus === "VERIFIED"
      ) {
        message =
          "Voter profile verified successfully. The user is now eligible to vote.";
      }

      if (
        requestedStatus === "REJECTED"
      ) {
        message =
          "Voter profile rejected successfully. The user is not eligible to vote.";
      }

      if (
        requestedStatus === "PENDING"
      ) {
        message =
          "Voter profile moved back to pending verification.";
      }

      return res.status(200).json({
        success: true,
        message,

        profile: {
          id: profile._id,
          user: profile.user,
          name: profile.name,
          voterId: profile.voterId,

          isComplete:
            profile.isComplete,

          isEligible:
            profile.isEligible,

          verificationStatus:
            profile.verificationStatus,

          verifiedAt:
            profile.verifiedAt,

          updatedAt:
            profile.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE VOTER VERIFICATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update voter verification status.",
      });
    }
  };

/* ======================================================
   BLOCK / UNBLOCK USER
   PATCH /api/users/:id/status
====================================================== */

export const toggleUserStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const user =
        await User.findById(id);

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

      user.isBlocked =
        !user.isBlocked;

      user.isActive =
        !user.isBlocked;

      if (user.isBlocked) {
        user.refreshToken = null;
        user.refreshTokenExpiresAt =
          null;
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
====================================================== */

export const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user =
      await User.findById(id);

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
       DELETE VOTER PROFILE
       BEFORE USER
    ----------------------------- */

    await VoterProfile.deleteOne({
      user: user._id,
    });

    /* -----------------------------
       DELETE USER
    ----------------------------- */

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully.",
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