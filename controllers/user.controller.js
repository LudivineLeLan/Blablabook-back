import { Book, Author, Genre, User } from '../models/index.js';
import Joi from "joi";
import jwt from "jsonwebtoken";
import { createUserSchema } from '../schemas/user.schema.js';
import { updateAccountSchema } from '../schemas/updateaccount.schema.js';
import argon2 from "argon2";


export const userController = {

  async getUsers(req, res) {
    try {
      const users = await User.findAll({
        include: [
          { model: Book, as: "books", through: { attributes: [] } },
        ]
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des users' });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id,
        {
          include: [
            { model: Book, as: "books", through: { attributes: [] } },
          ]
        }
      );
      // Inclure les auteurs et genres associés include: [Author, Genre]
      if (!user) return res.status(404).json({ error: 'User non trouvé' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },


  async createUser(req, res) {
    try {
      console.log("Données reçues :", req.body);
      const data = Joi.attempt(req.body, createUserSchema);
      const user = await User.create(data);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
  },


  async loginUser(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username: username } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Utilisateur non valide' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const authUserId = req.user.id;

      if (parseInt(id) !== authUserId) {
        return res.status(403).json({ error: 'Vous ne pouvez pas supprimer ce compte' });
      }

      const deletedCount = await User.destroy({ where: { id } });

      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      return res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du compte' });
    }
  },


  async userAvatar(req, res) {

    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: `L'ID utilisateur est requis` });
      }
      user.avatar = req.file.path;
      await user.save();
      res.status(200).json({ message: 'Image téléchargée avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async editUserAccount(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "L'ID utilisateur est requis" });
      }

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

      const data = { ...req.body };

      // Si un fichier avatar est envoyé via multer
      if (req.file) {
        data.avatar = req.file.path;
      }
      console.log("🟢 req.file :", req.file);
      console.log("🟢 req.body :", req.body);

      // Valider toutes les données reçues
      const validatedData = Joi.attempt(data, updateAccountSchema, { abortEarly: false }); // renvoie toutes les erreurs et pas que la première

      // Si un mot de passe est présent, le hasher
      if (validatedData.password) {
        validatedData.password = await argon2.hash(validatedData.password);
      }

      // Mettre à jour l’utilisateur avec validatedData
      await user.update(validatedData);

      // ON génère un nouveau token lors de l'actualisation des infos
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log("NOUVEL AVATAR :", user.avatar)
      res.status(200).json({ user, token });

    } catch (error) {
      console.error(error);
      if (error.isJoi) {
        return res.status(400).json({ error: error.details.map(details => details.message).join(', ') });
      }
      res.status(500).json({ error: "Erreur lors de la modification des informations" });
    }
  }
};



