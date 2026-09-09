import { Tag } from "../models/tag.model.js";
import { Article } from "../models/article.model.js";

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const tagExist = await Tag.findOne({
      where: { name },
    });

    if (tagExist) {
      return res.status(400).json({ message: "La etiqueta ya existe" });
    }

    const tag = await Tag.create({ name });

    return res.status(201).json({
      message: "Etiqueta creada exitosamente",
      tag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [["name", "ASC"]],
    });

    return res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id, {
      include: {
        model: Article,
        as: "articulos",
        attributes: ["id", "title", "status"],
        through: { attributes: [] },
      },
    });

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    return res.status(200).json(tag);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    if (name) {
      const tagExist = await Tag.findOne({
        where: { name, id: { [Op.ne]: id } },
      });

      if (tagExist) {
        return res
          .status(400)
          .json({ message: "El nombre de la etiqueta ya está en uso" });
      }
    }

    await tag.update({ name });

    return res.status(200).json({
      message: "Etiqueta actualizada exitosamente",
      tag,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    await tag.destroy();

    return res
      .status(200)
      .json({ message: "Etiqueta eliminada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
