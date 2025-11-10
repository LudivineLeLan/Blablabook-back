import path from "path";
import { User, Book } from "../models/index.js";

export const adminController = {

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({ attributes: ["id", "firstname", "name", "email", "role"] });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors du chargement des utilisateurs." });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id } });
      res.json({ message: "Utilisateur supprimé." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression." });
    }
  },

  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Rôle invalide" });
      }

      user.role = role;
      await user.save();

      res.json({ message: "Rôle mis à jour", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur lors de la mise à jour du rôle" });
    }
  },


  async getAllBooks(req, res) {
    try {
      const books = await Book.findAll({
        include: ["authors", "genres"],
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors du chargement des livres." });
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      await Book.destroy({ where: { id } });
      res.json({ message: "Livre supprimé." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du livre." });
    }
  },

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, synopsis, release_date } = req.body;

      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ message: "Livre introuvable." });

      book.title = title || book.title;
      book.synopsis = synopsis || book.synopsis;
      book.release_date = release_date || book.release_date;

      await book.save();
      res.json({ message: "Livre mis à jour.", book });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du livre." });
    }
  },


  async uploadCover(req, res) {
    try {
      const book = await Book.findByPk(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé" });
      }
      book.cover = `${req.protocol}://${req.get("host")}/uploads/books/images/${req.file.filename
        }`;
      await book.save();

      res.status(200).json({
        message: "Image de couverture téléchargée avec succès",
        cover_url: book.cover,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
}
