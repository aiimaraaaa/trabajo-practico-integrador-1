import { Router } from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  getMyArticles,
  getMyArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createArticleValidation,
  updateArticleValidation,
} from "../validations/article.validation.js";

export const articleRouter = Router();

articleRouter.use(authMiddleware);

articleRouter.get("/articles", getAllArticles);
articleRouter.get("/articles/:id", getArticleById);

articleRouter.get("/my-articles", getMyArticles);
articleRouter.get("/my-articles/:id", getMyArticleById);

articleRouter.post(
  "/articles",
  createArticleValidation,
  validate,
  createArticle,
);

articleRouter.put(
  "/articles/:id",
  updateArticleValidation,
  validate,
  updateArticle,
);
articleRouter.delete("/articles/:id", deleteArticle);
