import { body } from "express-validator";

export const createTagValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre de la etiqueta no debe estar vacío")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre solo debe contener letras y números"),
];

export const updateTagValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre solo debe contener letras y números"),
];
