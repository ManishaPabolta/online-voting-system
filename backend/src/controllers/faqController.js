import FAQ from "../models/FAQ.js";

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();

    res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};