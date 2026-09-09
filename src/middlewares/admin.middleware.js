export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Se requiere rol de administrador" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
