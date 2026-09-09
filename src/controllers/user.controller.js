import { matchedData } from "express-validator";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Profile,
        as: "perfil",
      },
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
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

export const createUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

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
      lastName: lastName || "",
      biography: "",
      avatarUrl: "",
      birthDate: null,
    });

    return res.status(201).json({
      message: "Usuario creado exitosamente",
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

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (username) {
      const userExist = await User.findOne({
        where: { username, id: { [Op.ne]: id } },
      });

      if (userExist) {
        return res.status(400).json({ message: "El username ya está en uso" });
      }
    }

    if (email) {
      const emailExist = await User.findOne({
        where: { email, id: { [Op.ne]: id } },
      });

      if (emailExist) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = await hashPassword(password);

    await user.update(updateData);

    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
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

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
