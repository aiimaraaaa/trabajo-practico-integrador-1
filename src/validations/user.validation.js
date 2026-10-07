import { body, param } from "express-validator";
import { User } from "../models/user.model.js";

//  CREATE USER 
export const createUserValidation = [
  body("username")
    .notEmpty()
    .withMessage("El username no debe estar vacío")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo debe contener letras y números"),
  body("email")
    .notEmpty()
    .withMessage("El email no debe estar vacío")
    .isEmail()
    .withMessage("El email debe ser válido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña no debe estar vacía")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe tener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe tener al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe tener al menos un número"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
];

//  UPDATE USER (agrega validación de ID en params) 
export const updateUserValidation = [
  //  valida que el ID sea entero y exista
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .custom(async (id) => {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("El usuario no existe");
      }
      return true;
    }),
  body("username")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo debe contener letras y números"),
  body("email").optional().isEmail().withMessage("El email debe ser válido"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe tener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe tener al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe tener al menos un número"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
];

//  para GET y DELETE por ID
export const userIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .custom(async (id) => {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("El usuario no existe");
      }
      return true;
    }),
];

// para validar el body al actualizar perfil
export const updateProfileValidation = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha()
    .withMessage("El nombre solo debe contener letras"),
  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha()
    .withMessage("El apellido solo debe contener letras"),
  body("biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La biografía no debe superar los 500 caracteres"),
  body("avatarUrl").optional().isURL().withMessage("La URL del avatar no es válida"),
];