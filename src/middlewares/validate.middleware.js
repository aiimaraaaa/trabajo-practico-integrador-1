import { validationResult } from "express-validator";

// Recoge errores de express-validator.
// Si hay → 400 con la lista. Si no → pasa al controller.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const custom = errors.formatWith((err) => `${err.path}: ${err.msg}`);
    return res.status(400).json(custom.array());
  }
  next();
};