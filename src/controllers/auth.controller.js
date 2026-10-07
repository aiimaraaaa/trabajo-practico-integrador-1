import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

//  REGISTER 
export const register = async (req, res) => {
  try {
    // matchedData (solo campos validados)
    const data = matchedData(req);
    const { username, email, password, firstName, lastName, role } = data;

    const userExist = await User.findOne({ where: { username } });
    if (userExist) {
      return res.status(400).json({ message: "El username ya está en uso" });
    }
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    
    await Profile.create({
      userId: user.id,
      firstName: firstName || username,
      lastName: lastName || "Sinapellido",
      biography: null,
      avatarUrl: null,
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

//  LOGIN 
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: { model: Profile, as: "perfil" },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hora
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

//  LOGOUT 
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout exitoso" });
};

//  PROFILE 
export const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: Profile, as: "perfil" },
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

// UPDATE PROFILE 
export const updateProfile = async (req, res) => {
  try {
    const data = matchedData(req);

    const profileExist = await Profile.findOne({
      where: { userId: req.user.id },
    });
    if (!profileExist) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    await profileExist.update(data);

    return res.status(200).json({
      message: "Perfil actualizado exitosamente",
      profile: profileExist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};