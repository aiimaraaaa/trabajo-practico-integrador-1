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
  userIdValidation,
} from "../validations/user.validation.js";

export const userRouter = Router();

userRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidation,
  validate,
  getUserById,
);
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
userRouter.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidation,
  validate,
  deleteUser,
);