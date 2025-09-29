import express from "express";
import {
  addStock,
  getStocks,
  getStockSummary,
  transferStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.post("/add", addStock); // Add stock to bin
router.get("/", getStocks); // Get stock list
router.post("/transfer", transferStock); // Move stock between bins
router.get("/summary", getStockSummary);

export default router;
