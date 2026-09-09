import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({
      where: { username },
    });

    if (userExist) {
      return res.status(400).json({ message: "El username ya está en uso" });
    }

    const emailExist = await User.findOne({
      where: { email },
    });

    if (emailExist) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Crear perfil
    await Profile.create({
      userId: user.id,
      firstName: firstName || username,
      lastName: lastName || "",
      biography: "",
      avatarUrl: "",
      birthDate: null,
    });

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({
      where: { username },
      include: {
        model: Profile,
        as: "perfil",
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Verificar contraseña
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Enviar token como cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout exitoso" });
};

export const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Profile,
        as: "perfil",
      },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
