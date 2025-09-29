import express from "express";
import multer from "multer";
import { uploadDocument, getDocuments } from "../../controllers/FinanceModule/uploadDocument.js";

const router = express.Router();

// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route
router.post(
  "/",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "income", maxCount: 1 },
    { name: "asset", maxCount: 1 },
  ]),
  uploadDocument
);

// Fetch all documents
router.get("/", getDocuments);

export default router;
