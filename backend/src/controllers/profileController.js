import mongoose from "mongoose";

import VoterProfile from "../models/VoterProfile.js";
import User from "../models/User.js";

// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeString = (value) => {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value).trim();
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id || null;
};

// ======================================================
// CREATE / COMPLETE VOTER PROFILE
// ======================================================

export const createProfile = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authenticated user.",
      });
    }

    // --------------------------------------------------
    // Get input
    // --------------------------------------------------

    const {
      name,
      age,
      gender,
      address,
      phone,
      aadhaarNumber,
      voterId,
      city,
      state,
      pincode,
    } = req.body;

    const normalizedName =
      normalizeString(name);

    const normalizedAddress =
      normalizeString(address);

    const normalizedPhone =
      normalizeString(phone);

    const normalizedAadhaar =
      normalizeString(aadhaarNumber);

    const normalizedVoterId =
      normalizeString(voterId).toUpperCase();

    const normalizedCity =
      normalizeString(city);

    const normalizedState =
      normalizeString(state);

    const normalizedPincode =
      normalizeString(pincode);

    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (
      !normalizedName ||
      !age ||
      !gender ||
      !normalizedAddress ||
      !normalizedPhone ||
      !normalizedAadhaar ||
      !normalizedVoterId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete all required profile fields.",
      });
    }

    // --------------------------------------------------
    // Name validation
    // --------------------------------------------------

    if (
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain between 2 and 100 characters.",
      });
    }

    // --------------------------------------------------
    // Age validation
    // --------------------------------------------------

    const numericAge = Number(age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge < 18 ||
      numericAge > 120
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Voter must be between 18 and 120 years old.",
      });
    }

    // --------------------------------------------------
    // Gender validation
    // --------------------------------------------------

    const allowedGenders = [
      "Male",
      "Female",
      "Other",
    ];

    if (
      !allowedGenders.includes(
        gender
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a valid gender.",
      });
    }

    // --------------------------------------------------
    // Aadhaar validation
    // --------------------------------------------------

    if (
      !/^\d{12}$/.test(
        normalizedAadhaar
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Aadhaar number must contain exactly 12 digits.",
      });
    }

    // --------------------------------------------------
    // Voter ID validation
    // --------------------------------------------------

    if (
      normalizedVoterId.length < 3 ||
      normalizedVoterId.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid Voter ID.",
      });
    }

    // --------------------------------------------------
    // Phone validation
    // --------------------------------------------------

    if (
      !/^[0-9+\-\s()]{7,20}$/.test(
        normalizedPhone
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid phone number.",
      });
    }

    // --------------------------------------------------
    // Check authenticated user
    // --------------------------------------------------

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account not found.",
      });
    }

    if (
      user.isActive === false ||
      user.isBlocked === true
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is not allowed to create a voter profile.",
      });
    }

    // --------------------------------------------------
    // Check existing profile
    // --------------------------------------------------

    const existingProfile =
      await VoterProfile.findOne({
        user: userId,
      });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message:
          "Voter profile already exists. Use update profile instead.",
      });
    }

    // --------------------------------------------------
    // Check duplicate Voter ID
    // --------------------------------------------------

    const existingVoterId =
      await VoterProfile.findOne({
        voterId:
          normalizedVoterId,
      }).select("_id");

    if (existingVoterId) {
      return res.status(409).json({
        success: false,
        message:
          "This Voter ID is already registered.",
      });
    }

    // --------------------------------------------------
    // Create profile
    // --------------------------------------------------
    //
    // IMPORTANT:
    //
    // User does NOT automatically become verified.
    //
    // Initial state:
    //
    // PENDING
    // isEligible = false
    //
    // Admin verification will later change it to:
    //
    // VERIFIED
    // isEligible = true
    //
    // This prevents a user from self-approving their
    // voting eligibility.

    const profile =
      await VoterProfile.create({
        user: userId,

        name:
          normalizedName,

        age:
          numericAge,

        gender,

        address:
          normalizedAddress,

        phone:
          normalizedPhone,

        aadhaarNumber:
          normalizedAadhaar,

        voterId:
          normalizedVoterId,

        idProof:
          req.file?.path || "",

        city:
          normalizedCity,

        state:
          normalizedState,

        pincode:
          normalizedPincode,

        isComplete: true,

        isEligible: false,

        verificationStatus:
          "PENDING",

        verifiedAt: null,
      });

    // --------------------------------------------------
    // Update basic user information
    // --------------------------------------------------

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profileCompleted: true,
          voterId:
            normalizedVoterId,
          phone:
            normalizedPhone,
        },
      }
    );

    // --------------------------------------------------
    // Response
    // --------------------------------------------------
    //
    // Aadhaar is select:false in the model and should
    // never be returned to the frontend.

    return res.status(201).json({
      success: true,
      message:
        "Voter profile submitted successfully. Please wait for admin verification.",

      profile: {
        id: profile._id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        phone: profile.phone,
        voterId: profile.voterId,
        idProof: profile.idProof,
        isComplete:
          profile.isComplete,
        isEligible:
          profile.isEligible,
        verificationStatus:
          profile.verificationStatus,
        verifiedAt:
          profile.verifiedAt,
        createdAt:
          profile.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "CREATE PROFILE ERROR:",
      error
    );

    // --------------------------------------------------
    // Duplicate key
    // --------------------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Voter ID or voter profile already exists.",
      });
    }

    // --------------------------------------------------
    // Mongoose validation
    // --------------------------------------------------

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid voter profile information.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to create voter profile.",
    });
  }
};

// ======================================================
// GET MY PROFILE
// ======================================================

export const getMyProfile = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const profile =
      await VoterProfile.findOne({
        user: userId,
      }).populate(
        "user",
        "name email voterId profileImage phone role profileCompleted"
      );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          "Voter profile not found.",
        profileRequired: true,
      });
    }

    // --------------------------------------------------
    // Build safe response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      profile: {
        id: profile._id,

        user:
          profile.user,

        name:
          profile.name,

        age:
          profile.age,

        gender:
          profile.gender,

        address:
          profile.address,

        city:
          profile.city,

        state:
          profile.state,

        pincode:
          profile.pincode,

        phone:
          profile.phone,

        voterId:
          profile.voterId,

        idProof:
          profile.idProof,

        profilePhoto:
          profile.profilePhoto,

        isComplete:
          profile.isComplete,

        isEligible:
          profile.isEligible,

        verificationStatus:
          profile.verificationStatus,

        verifiedAt:
          profile.verifiedAt,

        createdAt:
          profile.createdAt,

        updatedAt:
          profile.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch profile.",
    });
  }
};

// ======================================================
// UPDATE PROFILE
// ======================================================

export const updateProfile = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const profile =
      await VoterProfile.findOne({
        user: userId,
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message:
          "Voter profile not found.",
        profileRequired: true,
      });
    }

    // --------------------------------------------------
    // Editable fields
    // --------------------------------------------------

    const editableFields = [
      "name",
      "address",
      "phone",
      "city",
      "state",
      "pincode",
    ];

    editableFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          profile[field] =
            normalizeString(
              req.body[field]
            );
        }
      }
    );

    // --------------------------------------------------
    // Validate updated name
    // --------------------------------------------------

    if (
      profile.name.length < 2 ||
      profile.name.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain between 2 and 100 characters.",
      });
    }

    // --------------------------------------------------
    // Validate phone
    // --------------------------------------------------

    if (
      !/^[0-9+\-\s()]{7,20}$/.test(
        profile.phone
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid phone number.",
      });
    }

    // --------------------------------------------------
    // Validate pincode
    // --------------------------------------------------

    if (
      profile.pincode &&
      !/^[0-9]{4,10}$/.test(
        profile.pincode
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid pincode.",
      });
    }

    // --------------------------------------------------
    // ID proof
    // --------------------------------------------------

    if (req.file?.path) {
      profile.idProof =
        req.file.path;
    }

    // --------------------------------------------------
    // Important verification rule
    // --------------------------------------------------
    //
    // Changing personal information after verification
    // should send the profile back for review.
    //
    // This prevents a verified voter from changing
    // important information and remaining automatically
    // eligible.

    const changedVerificationFields =
      [
        "name",
        "address",
        "phone",
        "city",
        "state",
        "pincode",
      ].some(
        (field) =>
          req.body[field] !==
          undefined
      ) || Boolean(req.file);

    if (
      changedVerificationFields &&
      profile.verificationStatus ===
        "VERIFIED"
    ) {
      profile.verificationStatus =
        "PENDING";

      profile.isEligible =
        false;

      profile.verifiedAt =
        null;
    }

    // --------------------------------------------------
    // Keep completeness
    // --------------------------------------------------

    const requiredFields = [
      profile.name,
      profile.age,
      profile.gender,
      profile.address,
      profile.phone,
      profile.voterId,
    ];

    profile.isComplete =
      requiredFields.every(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      );

    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    await profile.save();

    // --------------------------------------------------
    // Update User
    // --------------------------------------------------

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name:
            profile.name,

          phone:
            profile.phone,
        },
      }
    );

    // --------------------------------------------------
    // Safe response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        profile.verificationStatus ===
        "PENDING"
          ? "Profile updated successfully. Your profile is pending verification."
          : "Profile updated successfully.",

      profile: {
        id:
          profile._id,

        name:
          profile.name,

        age:
          profile.age,

        gender:
          profile.gender,

        address:
          profile.address,

        city:
          profile.city,

        state:
          profile.state,

        pincode:
          profile.pincode,

        phone:
          profile.phone,

        voterId:
          profile.voterId,

        idProof:
          profile.idProof,

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
      "UPDATE PROFILE ERROR:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid profile information.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update profile.",
    });
  }
};