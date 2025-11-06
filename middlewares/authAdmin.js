import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        error: "Accès refusé : vous devez être authentifié pour accéder à cette ressource",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Accès interdit : admin requis" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur authAdmin :", error);
    return res.status(401).json({ error: "Authentification invalide" });
  }
};
