import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    /* =====================================================
       USER
    ===================================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =====================================================
       NOTIFICATION CONTENT
    ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

    /* =====================================================
       NOTIFICATION TYPE
    ===================================================== */

    type: {
      type: String,
      enum: [
        "NEW_ELECTION",
        "ELECTION_UPDATED",
        "ELECTION_STARTED",
        "ELECTION_EXPIRED",
        "ELECTION_CANCELLED",
        "VOTE_CAST",
        "VOTE_CONFIRMATION",
        "WINNER_DECLARED",
        "RESULT_PUBLISHED",
        "CANDIDATE_ADDED",
        "PROFILE_UPDATE",
        "OTP",
        "SECURITY",
        "SYSTEM",
        "FEEDBACK",
        "SUPPORT",
        "REPORT",
      ],
      default: "SYSTEM",
      index: true,
    },

    /* =====================================================
       RELATED ELECTION
    ===================================================== */

    relatedElection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      default: null,
      index: true,
    },

    /* =====================================================
       RELATED CANDIDATE
    ===================================================== */

    relatedCandidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
      index: true,
    },

    /* =====================================================
       READ STATUS
    ===================================================== */

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
       FRONTEND ACTION URL
    ===================================================== */

    actionUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
      validate: {
        validator: function (value) {
          if (!value) return true;

          /*
           * Only application-relative paths are accepted.
           * Examples:
           * /elections/123
           * /notifications
           * /profile
           */
          return value.startsWith("/");
        },

        message:
          "Action URL must be an application-relative path.",
      },
    },

    /* =====================================================
       PRIORITY
    ===================================================== */

    priority: {
      type: String,
      enum: [
        "LOW",
        "NORMAL",
        "HIGH",
        "URGENT",
      ],
      default: "NORMAL",
      index: true,
    },

    /* =====================================================
       EXPIRATION
    ===================================================== */

    expiresAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   INDEXES
========================================================= */

/*
 * Fast notification list + unread count.
 */
notificationSchema.index({
  user: 1,
  isRead: 1,
  createdAt: -1,
});

/*
 * Fast complete notification history.
 */
notificationSchema.index({
  user: 1,
  createdAt: -1,
});

/*
 * Useful for priority-based notification queries.
 */
notificationSchema.index({
  user: 1,
  priority: 1,
  createdAt: -1,
});

/*
 * Automatically remove notifications after expiresAt.

 * partialFilterExpression prevents notifications with
 * expiresAt = null from being affected by this TTL index.
 */
notificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      expiresAt: {
        $type: "date",
      },
    },
  }
);

/* =========================================================
   VALIDATION
========================================================= */

notificationSchema.pre("validate", function (next) {
  /*
   * If notification is unread, readAt should be null.
   */
  if (this.isRead === false) {
    this.readAt = null;
  }

  /*
   * If notification is read but readAt is missing,
   * automatically set it.
   */
  if (this.isRead === true && !this.readAt) {
    this.readAt = new Date();
  }

  next();
});

/* =========================================================
   JSON TRANSFORM
========================================================= */

notificationSchema.set("toJSON", {
  virtuals: true,
});

notificationSchema.set("toObject", {
  virtuals: true,
});

/* =========================================================
   MODEL
========================================================= */

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;