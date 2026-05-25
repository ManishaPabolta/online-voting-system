import Election from "../models/Election.js";

// ================= CREATE =================
export const createElection = async (
  req,
  res
) => {
  try {

    const {
      title,
      description,
      startDate,
      endDate,
      candidates,
    } = req.body;

    const formattedCandidates =
      Array.isArray(candidates)
        ? candidates.map((c) => ({
            name: c.name || "",
            image: c.image || "",
            party: c.party || "",
            votes: 0,
          }))
        : [];

    const election =
      await Election.create({
        title,
        description,
        startDate,
        endDate,
        candidates:
          formattedCandidates,
      });

    return res.status(201).json({
      success: true,
      election,
    });

  } catch (error) {

    console.log(
      "CREATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
export const getAllElections =
  async (req, res) => {

    try {

      const elections =
        await Election.find().sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        elections,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= GET SINGLE =================
export const getElectionById =
  async (req, res) => {

    try {

      const election =
        await Election.findById(
          req.params.id
        );

      if (!election) {

        return res.status(404).json({
          success: false,
          message:
            "Election not found",
        });
      }

      return res.status(200).json({
        success: true,
        election,
      });

    } catch (error) {

      console.log(
        "GET SINGLE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= UPDATE =================
export const updateElection =
  async (req, res) => {

    try {

      const election =
        await Election.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      return res.status(200).json({
        success: true,
        election,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================= DELETE =================
export const deleteElection =
  async (req, res) => {

    try {

      await Election.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Election deleted successfully",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };