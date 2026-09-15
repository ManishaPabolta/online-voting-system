import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5000,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "GENERAL",
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({
  category: 1,
  isPublished: 1,
  order: 1,
});

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;