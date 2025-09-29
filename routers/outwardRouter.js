import express from "express";
import {
  createStockOutward,
  getOutwardReport,
} from "../controllers/StockOutwardController.js";

const router = express.Router();

// Outward stock movement
router.post("/", createStockOutward);
router.get("/", getOutwardReport);

export default router;
