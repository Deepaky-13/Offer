import express from "express";
import multer from "multer";
import {
  createLoanDetails,
  getLoanDetails,
} from "../../controllers/FinanceModule/loanDetailsController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "invoice", maxCount: 1 },
    { name: "shopDetails", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  createLoanDetails
);

router.get("/", getLoanDetails);

export default router;
