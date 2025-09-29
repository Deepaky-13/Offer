import express from "express";
import { getOfficeDetailsController, getStatus, getStatusResult, officeInfo } from "../../controllers/FinanceModule/officeInfo.js";

const router = express.Router();

router.post("/", officeInfo);

router.get("/", getOfficeDetailsController);

router.get("/requests", getStatus);

router.patch("/loan/:id/status", getStatusResult);

export default router;
