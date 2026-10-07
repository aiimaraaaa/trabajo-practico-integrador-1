import jwt from "jsonwebtoken";

// Genera un JWT con el payload firmado
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    throw new Error("Error generando el token: " + error.message);
  }
};

// Verifica el token; si es válido devuelve el payload
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Error verificando el token: " + error.message);
  }
};