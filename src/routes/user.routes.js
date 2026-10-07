import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserValidation,
  updateUserValidation,
} from "../validations/user.validation.js";

export const userRouter = Router();

// Cada ruta tiene sus middlewares (NO usar .use() acá)
userRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
userRouter.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  createUserValidation,
  validate,
  createUser,
);
userRouter.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  updateUserValidation,
  validate,
  updateUser,
);
userRouter.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);