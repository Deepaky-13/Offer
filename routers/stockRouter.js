import express from "express";
import {
  createStockExchange,
  getAllExchanges,
  getExchangeById,
  approveRequest,
  rejectRequest,
  getPendingRequests,
} from "../controllers/stockExchangeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware); // protect all

router.post("/", createStockExchange); // create or request
router.get("/", getAllExchanges); // list (optionally ?status=pending)
router.get("/pending", getPendingRequests); // admin view
router.post("/approve/:id", approveRequest); // admin approves
router.post("/reject/:id", rejectRequest); // admin rejects
router.get("/:id", getExchangeById);

export default router;
