import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { startDB } from "./src/config/database.js";

import { User } from "./src/models/user.model.js";
import { Profile } from "./src/models/profile.model.js";
import { Article } from "./src/models/article.model.js";
import { Tag } from "./src/models/tag.model.js";
import { ArticleTag } from "./src/models/articleTag.model.js";

import { authRouter } from "./src/routes/auth.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { articleRouter } from "./src/routes/article.routes.js";
import { tagRouter } from "./src/routes/tag.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

User.hasOne(Profile, { foreignKey: "userId", as: "perfil" });
Profile.belongsTo(User, { foreignKey: "userId", as: "usuario" });

User.hasMany(Article, { foreignKey: "userId", as: "articulos" });
Article.belongsTo(User, { foreignKey: "userId", as: "autor" });

Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: "articleId",
  as: "etiquetas",
  onDelete: "CASCADE",
});
Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: "tagId",
  as: "articulos",
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", articleRouter);
app.use("/api", tagRouter);

app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor en http://localhost:${PORT}`);
});

export default app;
