import argon2 from "argon2";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { loginSchema } from "../schemas/login.schema.js";
import { registerSchema } from "../schemas/register.schema.js";

export const userAuthentificationController = {
  async register(req, res) {
    try {
      const { name, email, password, firstname, age } = Joi.attempt(req.body, registerSchema);

      const UserExists = await User.findOne({
        where: { email }
      });

      if (UserExists) {
        return res.status(409).json({ error: "Utilisateur déjà existant" });
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = await User.create({
        name,
        email,
        firstname,
        age,
        password: hashedPassword,
        avatar: req.file ? req.file.path : null
      });

      // Générer le token
      const token = jwt.sign(
        {
          email: newUser.email,
          id: newUser.id
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Renvoyer le token ET l'utilisateur
      res.status(201).json({
        message: "Compte créé",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          firstname: newUser.firstname,
          email: newUser.email,
          age: newUser.age,
          avatar: newUser.avatar
        }
      });
    } catch (error) {
      console.error("Error register :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = Joi.attempt(req.body, loginSchema);

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "Cet utilisateur n'existe pas" });
      }

      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        return res.status(403).json({ error: "Mot de passe incorrect" });
      }

      const token = jwt.sign(
        {
          email: user.email,
          id: user.id
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Renvoyer le token ET l'utilisateur
      res.status(200).json({
        message: "Utilisateur connecté",
        token,
        user: {
          id: user.id,
          name: user.name,
          firstname: user.firstname,
          email: user.email,
          age: user.age
        }
      });
    } catch (error) {
      console.error("Error login :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async getMe(req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: ["id", "name", "email", "firstname", "age", "avatar"]
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur n'existe pas" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Erreur getMe :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};