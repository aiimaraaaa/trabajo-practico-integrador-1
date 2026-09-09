import { body } from "express-validator";

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

export const updateUserValidation = [
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
