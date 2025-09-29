import express from "express";
import { getZipController, zipVerify } from "../../controllers/FinanceModule/zipVerify.js";
const router = express.Router();

router.post("/", zipVerify);

router.get("/customer/:customerId", getZipController);

export default router;
