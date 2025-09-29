import express from "express";
import { createAdditionalDetails, getAdditionalDetailsController } from "../../controllers/FinanceModule/additionalInfo.js";

const router = express.Router();

router.post("/", createAdditionalDetails);

router.get("/", getAdditionalDetailsController);

export default router;
