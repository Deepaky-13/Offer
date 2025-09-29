import { Router } from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getBarCode,
} from "../controllers/productController.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.route("/").post(upload.single("file"), createProduct).get(getProducts);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

router.route("/print/:id").get(getBarCode); // Placeholder for print route

export default router;
