import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    /* =====================================================
       ELECTION REFERENCE

       Every candidate belongs to exactly one election.
       Candidate itself acts as a voting option.
    ===================================================== */

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    /* =====================================================
       CANDIDATE / OPTION NAME

       Required because every voting option must have
       a name.
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    /* =====================================================
       PARTY

       Optional.

       Political election:
       "BJP", "Congress", etc.

       Non-political election:
       Can be empty.
    ===================================================== */

    party: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    /* =====================================================
       SYMBOL

       Optional election symbol / option symbol.
    ===================================================== */

    symbol: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    /* =====================================================
       PHOTO

       Can store:
       - Cloudinary URL
       - Other valid image URL
       - Empty string if no photo is provided
    ===================================================== */

    photo: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       MANIFESTO

       Optional.
       Useful for political elections.
    ===================================================== */

    manifesto: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    /* =====================================================
       BIOGRAPHY

       Optional candidate / option description.
    ===================================================== */

    biography: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    /* =====================================================
       EXPERIENCE

       Optional.
    ===================================================== */

    experience: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    /* =====================================================
       POSITION

       Examples:
       President
       Secretary
       Class Representative

       Optional.
    ===================================================== */

    position: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    /* =====================================================
       VOTE COUNT

       Kept as a cached / compatibility field.

       IMPORTANT:
       Final results must be calculated from Vote
       collection, not trusted from this field.
    ===================================================== */

    voteCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* =====================================================
       ACTIVE STATUS

       Admin can deactivate an option instead of deleting
       it.

       This is especially useful if votes already exist.
    ===================================================== */

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   UNIQUE NAME PER ELECTION

   Same name can exist in different elections.

   Example:

   Rahul → Election A     ✅
   Rahul → Election B     ✅

   But:

   Rahul → Election A
   Rahul → Election A     ❌
========================================================= */

candidateSchema.index(
  {
    election: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

/* =========================================================
   ACTIVE OPTIONS BY ELECTION
========================================================= */

candidateSchema.index({
  election: 1,
  isActive: 1,
});

/* =========================================================
   ELECTION OPTIONS SORTING
========================================================= */

candidateSchema.index({
  election: 1,
  createdAt: 1,
});

/* =========================================================
   JSON / OBJECT CONFIGURATION
========================================================= */

candidateSchema.set("toJSON", {
  virtuals: true,
});

candidateSchema.set("toObject", {
  virtuals: true,
});

/* =========================================================
   MODEL
========================================================= */

const Candidate = mongoose.model(
  "Candidate",
  candidateSchema
);

export default Candidate;