import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserValidation } from "../validations/user.validation.js";

export const authRouter = Router();

authRouter.post("/register", createUserValidation, validate, register);
authRouter.post("/login", login);

authRouter.get("/profile", authMiddleware, profile);
authRouter.post("/logout", authMiddleware, logout);
