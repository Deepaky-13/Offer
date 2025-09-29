import express from "express";
import {
  login,
  logout,
  createUser,
  getUsers,
  getCurrentUser,
  updateUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.use(authMiddleware);
router.post("/users", createUser);
router.get("/users", getUsers);
router.patch("/users/:id", updateUser);
router.get("/me", getCurrentUser);

export default router;
