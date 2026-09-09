import { Router } from "express";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTagValidation,
  updateTagValidation,
} from "../validations/tag.validation.js";

export const tagRouter = Router();

tagRouter.get("/tags", authMiddleware, getAllTags);

tagRouter.post(
  "/tags",
  authMiddleware,
  adminMiddleware,
  createTagValidation,
  validate,
  createTag,
);
tagRouter.get("/tags/:id", authMiddleware, adminMiddleware, getTagById);
tagRouter.put(
  "/tags/:id",
  authMiddleware,
  adminMiddleware,
  updateTagValidation,
  validate,
  updateTag,
);
tagRouter.delete("/tags/:id", authMiddleware, adminMiddleware, deleteTag);
