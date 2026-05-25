import mongoose from "mongoose";

const voterProfileSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      age: {
        type: Number,
        required: true,
      },

      gender: {
        type: String,

        enum: [
          "Male",
          "Female",
          "Other",
        ],

        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      aadhaarNumber: {
        type: String,
        required: true,
      },

      voterId: {
        type: String,
        required: true,
      },

      idProof: {
        type: String,
      },

      isComplete: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

const VoterProfile =
  mongoose.model(
    "VoterProfile",
    voterProfileSchema
  );

export default VoterProfile;