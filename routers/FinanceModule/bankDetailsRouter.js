import express from "express";
import { createBankDetails } from "../../controllers/FinanceModule/bankDetailsController.js";

const router = express.Router();

router.post("/", createBankDetails);

export default router;