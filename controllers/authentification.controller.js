import argon2 from "argon2";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { loginSchema } from "../schemas/login.schema.js";
import { registerSchema } from "../schemas/register.schema.js";
import { sendEmail } from "../config/email.js"; // pour gérer l'envoi de mails auto
import { v4 as uuidv4 } from "uuid"; // utilisé AVANT la connexion pour valider un lien unique


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
      const tokenConfirm = uuidv4();


      const newUser = await User.create({
        name,
        email,
        firstname,
        age,
        password: hashedPassword,
        avatar: req.file ? req.file.path : null,
        is_confirmed: false,
        token_confirm: tokenConfirm
      });

      // Lien de confirmation
      const confirmLink = `http://localhost:3000/api/auth/confirm/${tokenConfirm}`;

      await sendEmail(process.env.EMAILJS_TEMPLATE_ID_CONFIRM, email, { confirm_link: confirmLink });

      res.status(201).json({
        message: "Compte créé ! Vérifie ton email pour le confirmer avant de te connecter."
      });
    } catch (error) {
      console.error("Error register :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
  /*  // Générer le token
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
}, */

  async confirmAccount(req, res) {
    try {
      const { token } = req.params;

      const user = await User.findOne({ where: { token_confirm: token } });
      if (!user) return res.status(400).json({ error: "Lien invalide ou expiré." });

      user.is_confirmed = true;
      user.token_confirm = null;
      await user.save();

      res.status(200).json({ message: "Compte confirmé" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la confirmation du compte." });
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

      if (!user.is_confirmed) {
        return res.status(403).json({ error: "Compte non validé" });
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

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "Email non trouvé" });

      const tokenReset = uuidv4();
      user.token_reset = tokenReset;
      user.token_reset_expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
      await user.save();

      const resetLink = `http://localhost:3000/api/auth/reset-password/${tokenReset}`;
      await sendEmail(process.env.EMAILJS_TEMPLATE_ID_RESET, email, { reset_link: resetLink });

      res.status(200).json({ message: "Un lien de réinitialisation a été envoyé à ton adresse email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({ where: { token_reset: token } });
      if (!user || user.token_reset_expires < new Date()) {
        return res.status(400).json({ error: "Lien invalide ou expiré." });
      }

      const hashedPassword = await argon2.hash(password);
      user.password = hashedPassword;
      user.token_reset = null;
      user.token_reset_expires = null;
      await user.save();

      res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

};