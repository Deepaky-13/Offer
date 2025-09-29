import express from "express";
import {
  createScheme,
  getAllSchemes,
  getSchemesForLoan,
  getScheme,
  updateScheme,
  deleteScheme,
} from "../../controllers/FinanceModule/SChemeController.js";

const router = express.Router();

// Admin routes
router.post("/", createScheme); // Create scheme template
router.get("/", getAllSchemes); // Get all schemes (admin)
router.get("/:id", getScheme); // Get single scheme by ID
router.put("/:id", updateScheme); // Update scheme
router.delete("/:id", deleteScheme); // Delete scheme

// User route - dynamic loan-based calculation
router.get("/loan-based", getSchemesForLoan); // ?loanAmount=100000&downPayment=20000

export default router;