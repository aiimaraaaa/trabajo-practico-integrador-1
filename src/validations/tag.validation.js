import { body, param } from "express-validator";
import { Tag } from "../models/tag.model.js";

//  CREATE TAG 
export const createTagValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre de la etiqueta no debe estar vacío")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre solo debe contener letras y números"),
];

//  UPDATE TAG 
export const updateTagValidation = [
  //  ID en params
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .custom(async (id) => {
      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw new Error("La etiqueta no existe");
      }
      return true;
    }),
  body("name")
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre solo debe contener letras y números"),
];

// para GET y DELETE por ID
export const tagIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .custom(async (id) => {
      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw new Error("La etiqueta no existe");
      }
      return true;
    }),
];