import bcrypt from "bcrypt";

// Hashea la contraseña (irreversible)
export const hashPassword = async (password) => {
  const saltRounds = 10; // 10-12 recomendado
  return await bcrypt.hash(password, saltRounds);
};

// Compara contraseña con el hash guardado
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};