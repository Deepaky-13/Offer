import express from "express";
import { createUserDetails, getUserDetailsController } from "../../controllers/FinanceModule/userDetails.js";

const router = express.Router();

router.post("/", createUserDetails);

router.get("/", getUserDetailsController);

export default router;
