import FAQ from "../models/FAQ.js";

// ======================================================
// GET FAQs
// ======================================================

export const getFAQs = async (
  req,
  res
) => {
  try {
    const filter = {
      isPublished: true,
    };

    if (req.query.category) {
      filter.category =
        req.query.category;
    }

    const faqs =
      await FAQ.find(filter).sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    console.error(
      "GET FAQ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch FAQs.",
    });
  }
};

// ======================================================
// ADMIN GET ALL FAQs
// ======================================================

export const getAllFAQs = async (
  req,
  res
) => {
  try {
    const faqs =
      await FAQ.find().sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error(
      "GET ALL FAQ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch FAQs.",
    });
  }
};

// ======================================================
// CREATE FAQ
// ======================================================

export const createFAQ = async (
  req,
  res
) => {
  try {
    const {
      question,
      answer,
      category,
      order,
    } = req.body;

    if (
      !question?.trim() ||
      !answer?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question and answer are required.",
      });
    }

    const faq =
      await FAQ.create({
        question: question.trim(),
        answer: answer.trim(),
        category:
          category || "GENERAL",
        order:
          Number(order) || 0,
        createdBy: req.user.id,
      });

    return res.status(201).json({
      success: true,
      message:
        "FAQ created successfully.",
      faq,
    });
  } catch (error) {
    console.error(
      "CREATE FAQ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create FAQ.",
    });
  }
};