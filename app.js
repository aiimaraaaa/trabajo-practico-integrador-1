// IMPORTS
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { startDB } from "./src/config/database.js";

// Modelos 
import { User } from "./src/models/user.model.js";
import { Profile } from "./src/models/profile.model.js";
import { Article } from "./src/models/article.model.js";
import { Tag } from "./src/models/tag.model.js";
import { ArticleTag } from "./src/models/articleTag.model.js";

// Routers 
import { authRouter } from "./src/routes/auth.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { articleRouter } from "./src/routes/article.routes.js";
import { tagRouter } from "./src/routes/tag.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// MIDDLEWARES GLOBALES

// Permite leer JSON en el body (req.body)
app.use(express.json());
// Lee las cookies (req.cookies.token)
app.use(cookieParser());
// CORS: permite peticiones del frontend CON cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// RELACIONES ENTRE MODELOS


// 1:1 → User ↔ Profile
User.hasOne(Profile, { foreignKey: "userId", as: "perfil" });
Profile.belongsTo(User, { foreignKey: "userId", as: "usuario" });

// 1:N → User → Articles
//  onDelete CASCADE 
User.hasMany(Article, { foreignKey: "userId", as: "articulos", onDelete: "CASCADE" });
Article.belongsTo(User, { foreignKey: "userId", as: "autor" });

// N:M → Articles ↔ Tags
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


// RUTAS

app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api", articleRouter);
app.use("/api", tagRouter);

app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;