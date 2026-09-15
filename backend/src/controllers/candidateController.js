import mongoose from "mongoose";

import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";

// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const getElectionState = (election) => {
  if (!election) return null;

  if (election.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (!election.isPublished) {
    return "DRAFT";
  }

  const now = new Date();

  if (now < election.startDate) {
    return "UPCOMING";
  }

  if (now >= election.startDate && now < election.endDate) {
    return "LIVE";
  }

  if (now >= election.endDate) {
    return "COMPLETED";
  }

  return election.status;
};

const getSafeCandidateData = (candidate) => {
  return {
    _id: candidate._id,
    election: candidate.election,
    name: candidate.name,
    party: candidate.party,
    symbol: candidate.symbol,
    photo: candidate.photo,
    manifesto: candidate.manifesto,
    biography: candidate.biography,
    experience: candidate.experience,
    position: candidate.position,
    voteCount: candidate.voteCount,
    isActive: candidate.isActive,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
};

// ======================================================
// CREATE CANDIDATE
// ======================================================

export const createCandidate = async (req, res) => {
  try {
    const {
      election,
      name,
      party,
      symbol,
      photo,
      manifesto,
      biography,
      experience,
      position,
    } = req.body;

    // --------------------------------------------------
    // Validate required fields
    // --------------------------------------------------

    if (!election || !name || !party) {
      return res.status(400).json({
        success: false,
        message:
          "Election, candidate name and party are required.",
      });
    }

    // --------------------------------------------------
    // Validate election ID
    // --------------------------------------------------

    if (!isValidObjectId(election)) {
      return res.status(400).json({
        success: false,
        message: "Invalid election ID.",
      });
    }

    const electionData = await Election.findById(election);

    if (!electionData) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    // --------------------------------------------------
    // Check election state
    // --------------------------------------------------

    const electionState = getElectionState(electionData);

    if (electionState === "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Candidates cannot be added while the election is live.",
      });
    }

    if (electionState === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidates cannot be added to a completed election.",
      });
    }

    if (electionState === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidates cannot be added to a cancelled election.",
      });
    }

    // --------------------------------------------------
    // Normalize fields
    // --------------------------------------------------

    const candidateName = normalizeString(name);
    const candidateParty = normalizeString(party);

    if (candidateName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate name must contain at least 2 characters.",
      });
    }

    if (candidateName.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate name cannot exceed 100 characters.",
      });
    }

    if (!candidateParty) {
      return res.status(400).json({
        success: false,
        message: "Candidate party is required.",
      });
    }

    if (candidateParty.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate party cannot exceed 100 characters.",
      });
    }

    // --------------------------------------------------
    // Prevent duplicate candidate
    // --------------------------------------------------

    const existingCandidate = await Candidate.findOne({
      election: electionData._id,
      name: candidateName,
    });

    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        message:
          "A candidate with this name already exists in this election.",
      });
    }

    // --------------------------------------------------
    // Create candidate
    // --------------------------------------------------

    const candidate = await Candidate.create({
      election: electionData._id,
      name: candidateName,
      party: candidateParty,
      symbol: normalizeString(symbol),
      photo: normalizeString(photo),
      manifesto: normalizeString(manifesto),
      biography: normalizeString(biography),
      experience: normalizeString(experience),
      position: normalizeString(position),
      voteCount: 0,
      isActive: true,
    });

    // --------------------------------------------------
    // Add candidate reference to election
    // --------------------------------------------------

    await Election.updateOne(
      {
        _id: electionData._id,
      },
      {
        $addToSet: {
          candidates: candidate._id,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully.",
      candidate: getSafeCandidateData(candidate),
    });
  } catch (error) {
    console.error("CREATE CANDIDATE ERROR:", error);

    // Mongo duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A candidate with this name already exists in this election.",
      });
    }

    // Mongoose validation
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: "Candidate validation failed.",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create candidate.",
    });
  }
};

// ======================================================
// GET ALL CANDIDATES
// ======================================================

export const getCandidates = async (req, res) => {
  try {
    const filter = {};

    // --------------------------------------------------
    // Election filter
    // --------------------------------------------------

    if (req.query.election) {
      if (!isValidObjectId(req.query.election)) {
        return res.status(400).json({
          success: false,
          message: "Invalid election ID.",
        });
      }

      filter.election = req.query.election;
    }

    // --------------------------------------------------
    // Active filter
    // --------------------------------------------------

    if (req.query.active !== undefined) {
      if (
        req.query.active !== "true" &&
        req.query.active !== "false"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The active query parameter must be true or false.",
        });
      }

      filter.isActive = req.query.active === "true";
    }

    const candidates = await Candidate.find(filter)
      .populate(
        "election",
        "title description electionType status startDate endDate isPublished isResultsPublished"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error("GET CANDIDATES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates.",
    });
  }
};

// ======================================================
// GET SINGLE CANDIDATE
// ======================================================

export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const candidate = await Candidate.findById(id)
      .populate(
        "election",
        "title description electionType status startDate endDate isPublished isResultsPublished"
      )
      .lean();

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    // --------------------------------------------------
    // Public candidate endpoint should not expose
    // candidates from unpublished elections
    // --------------------------------------------------

    if (
      !candidate.election ||
      candidate.election.isPublished !== true
    ) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("GET CANDIDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate.",
    });
  }
};

// ======================================================
// UPDATE CANDIDATE
// ======================================================

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // Validate candidate ID
    // --------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    // --------------------------------------------------
    // Find election
    // --------------------------------------------------

    const election = await Election.findById(
      candidate.election
    );

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    // --------------------------------------------------
    // Check election state
    // --------------------------------------------------

    const electionState = getElectionState(election);

    if (electionState === "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate details cannot be changed while voting is live.",
      });
    }

    if (electionState === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate details cannot be changed after the election is completed.",
      });
    }

    if (electionState === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate details cannot be changed for a cancelled election.",
      });
    }

    // --------------------------------------------------
    // Update name
    // --------------------------------------------------

    if (req.body.name !== undefined) {
      const newName = normalizeString(req.body.name);

      if (newName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate name must contain at least 2 characters.",
        });
      }

      if (newName.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate name cannot exceed 100 characters.",
        });
      }

      candidate.name = newName;
    }

    // --------------------------------------------------
    // Update party
    // --------------------------------------------------

    if (req.body.party !== undefined) {
      const newParty = normalizeString(req.body.party);

      if (!newParty) {
        return res.status(400).json({
          success: false,
          message: "Candidate party is required.",
        });
      }

      if (newParty.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate party cannot exceed 100 characters.",
        });
      }

      candidate.party = newParty;
    }

    // --------------------------------------------------
    // Update optional fields
    // --------------------------------------------------

    if (req.body.symbol !== undefined) {
      candidate.symbol = normalizeString(
        req.body.symbol
      );
    }

    if (req.body.photo !== undefined) {
      candidate.photo = normalizeString(
        req.body.photo
      );
    }

    if (req.body.manifesto !== undefined) {
      candidate.manifesto = normalizeString(
        req.body.manifesto
      );
    }

    if (req.body.biography !== undefined) {
      candidate.biography = normalizeString(
        req.body.biography
      );
    }

    if (req.body.experience !== undefined) {
      candidate.experience = normalizeString(
        req.body.experience
      );
    }

    if (req.body.position !== undefined) {
      candidate.position = normalizeString(
        req.body.position
      );
    }

    // --------------------------------------------------
    // Active / inactive
    // --------------------------------------------------

    if (req.body.isActive !== undefined) {
      let activeValue = req.body.isActive;

      // Support JSON boolean only
      if (typeof activeValue !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean.",
        });
      }

      candidate.isActive = activeValue;
    }

    // --------------------------------------------------
    // Prevent duplicate name
    // --------------------------------------------------

    const duplicateCandidate = await Candidate.findOne({
      _id: {
        $ne: candidate._id,
      },
      election: candidate.election,
      name: candidate.name,
    });

    if (duplicateCandidate) {
      return res.status(409).json({
        success: false,
        message:
          "Another candidate with this name already exists in this election.",
      });
    }

    await candidate.save();

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully.",
      candidate: getSafeCandidateData(candidate),
    });
  } catch (error) {
    console.error("UPDATE CANDIDATE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A candidate with this name already exists in this election.",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: "Candidate validation failed.",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update candidate.",
    });
  }
};

// ======================================================
// DELETE CANDIDATE
// ======================================================

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // Validate candidate ID
    // --------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    // --------------------------------------------------
    // Find election
    // --------------------------------------------------

    const election = await Election.findById(
      candidate.election
    );

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    // --------------------------------------------------
    // Check election state
    // --------------------------------------------------

    const electionState = getElectionState(election);

    if (electionState === "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate cannot be deleted while voting is live.",
      });
    }

    if (electionState === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate cannot be deleted after the election is completed.",
      });
    }

    if (electionState === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate cannot be deleted from a cancelled election.",
      });
    }

    // --------------------------------------------------
    // IMPORTANT:
    // Never physically delete a candidate if votes exist.
    // Vote history must remain intact.
    // --------------------------------------------------

    const voteCount = await Vote.countDocuments({
      candidate: candidate._id,
      election: election._id,
    });

    if (voteCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This candidate cannot be deleted because votes already exist. Deactivate the candidate instead.",
        voteCount,
      });
    }

    // --------------------------------------------------
    // Delete candidate
    // --------------------------------------------------

    await Candidate.deleteOne({
      _id: candidate._id,
    });

    // --------------------------------------------------
    // Remove candidate reference from election
    // --------------------------------------------------

    await Election.updateOne(
      {
        _id: election._id,
      },
      {
        $pull: {
          candidates: candidate._id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CANDIDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate.",
    });
  }
};