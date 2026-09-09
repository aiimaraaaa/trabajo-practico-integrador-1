import { body } from "express-validator";

export const createArticleValidation = [
  body("title")
    .notEmpty()
    .withMessage("El título no debe estar vacío")
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .notEmpty()
    .withMessage("El contenido no debe estar vacío")
    .isLength({ min: 50, max: 10000 })
    .withMessage("El contenido debe tener entre 50 y 10000 caracteres"),
  body("excerpt")
    .optional()
    .isLength({ max: 500 })
    .withMessage("El extracto no debe superar los 500 caracteres"),
  body("status")
    .optional()
    .isIn(["published", "archived"])
    .withMessage("El estado debe ser 'published' o 'archived'"),
];

export const updateArticleValidation = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("content")
    .optional()
    .isLength({ min: 50, max: 10000 })
    .withMessage("El contenido debe tener entre 50 y 10000 caracteres"),
  body("excerpt")
    .optional()
    .isLength({ max: 500 })
    .withMessage("El extracto no debe superar los 500 caracteres"),
  body("status")
    .optional()
    .isIn(["published", "archived"])
    .withMessage("El estado debe ser 'published' o 'archived'"),
];
