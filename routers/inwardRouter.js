import express from "express";
import {
  createStockInward,
  formatInwardDocument,
  getInwardReport,
} from "../controllers/StockInwardController.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
// Inward stock movement
router.post("/", upload.single("file"), createStockInward);
router.get("/", getInwardReport);

router.get("/export/:format", formatInwardDocument);

export default router;
