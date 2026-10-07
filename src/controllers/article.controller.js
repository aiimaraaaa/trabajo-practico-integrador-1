import { matchedData } from "express-validator";
import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";
import { Tag } from "../models/tag.model.js";

//  CREATE 
export const createArticle = async (req, res) => {
  try {
    //  matchedData
    const data = matchedData(req);
    const { title, content, excerpt, status, tags } = data;
    const userId = req.user.id;

    const article = await Article.create({
      title,
      content,
      excerpt: excerpt || null,
      status: status || "published",
      userId,
    });

    if (tags && tags.length > 0) {
      const tagInstances = await Tag.findAll({ where: { name: tags } });
      await article.addEtiquetas(tagInstances);
    }

    return res.status(201).json({
      message: "Artículo creado exitosamente",
      article,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//  GET ALL 
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { status: "published" },
      include: [
        { model: User, as: "autor", attributes: ["id", "username", "email"] },
        { model: Tag, as: "etiquetas", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//  GET BY ID 
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id, {
      include: [
        { model: User, as: "autor", attributes: ["id", "username", "email"] },
        { model: Tag, as: "etiquetas", attributes: ["id", "name"] },
      ],
    });
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    return res.status(200).json(article);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//  MY ARTICLES 
export const getMyArticles = async (req, res) => {
  try {
    const userId = req.user.id;
    const articles = await Article.findAll({
      where: { userId },
      include: [{ model: Tag, as: "etiquetas", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//  MY ARTICLE BY ID 
export const getMyArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const article = await Article.findOne({
      where: { id, userId },
      include: [{ model: Tag, as: "etiquetas", attributes: ["id", "name"] }],
    });
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    return res.status(200).json(article);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//  UPDATE 
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    //  matchedData
    const data = matchedData(req);
    const { title, content, excerpt, status, tags } = data;
    const userId = req.user.id;
    const userRole = req.user.role;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    if (article.userId !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este artículo" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (status) updateData.status = status;

    await article.update(updateData);

    if (tags) {
      const tagInstances = await Tag.findAll({ where: { name: tags } });
      await article.setEtiquetas(tagInstances);
    }

    return res.status(200).json({
      message: "Artículo actualizado exitosamente",
      article,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//  DELETE 
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    if (article.userId !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este artículo" });
    }

    await article.destroy();
    return res
      .status(200)
      .json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};