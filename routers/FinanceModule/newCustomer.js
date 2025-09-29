import express from "express";
import { createCustomer, getCustomerDetailsController } from "../../controllers/FinanceModule/createCustomer.js";

const router = express.Router();

router.post("/", createCustomer);

router.get("/",getCustomerDetailsController);

export default router;
