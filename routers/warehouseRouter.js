import express from "express";
import {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  addBinToWarehouse,
} from "../controllers/warehouseController.js";

const router = express.Router();

// Create warehouse
router.post("/", createWarehouse);

// Get all warehouses
router.get("/", getAllWarehouses);

// Get warehouse by ID
router.get("/:id", getWarehouseById);

// Add bin to warehouse
router.post("/:id/bins", addBinToWarehouse);

export default router;
