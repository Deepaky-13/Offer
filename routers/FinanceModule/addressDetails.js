import express from "express";
import { addressDetails, getAddressDetailController } from "../../controllers/FinanceModule/addressDetails.js";

const router = express.Router();

router.post("/", addressDetails);

router.get("/", getAddressDetailController)

export default router;
