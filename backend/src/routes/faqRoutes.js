import express from "express";

import { getFAQs } from "../controllers/faqController.js";

const router = express.Router();

router.get("/", getFAQs);

export default router;