import path from "path";
import { User, Book, Author } from "../models/index.js";

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
      const { title, synopsis, release_date, authors } = req.body;

      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ message: "Livre introuvable." });

      book.title = title || book.title;
      book.synopsis = synopsis || book.synopsis;
      book.release_date = release_date || book.release_date;

      if (req.file) {
        book.cover = `${req.protocol}://${req.get("host")}/uploads/books/images/${req.file.filename}`;
      }

      if (authors) {
        let parsedAuthors = [];
        try {
          parsedAuthors = JSON.parse(authors); // on convertit les auteurs en tableau d'objets & éviter une erreur 500
        } catch (error) {
          console.error("Erreur de parsing des auteurs :", error);
          return res.status(400).json({ message: "Format des auteurs invalide." });
        }
        await book.setAuthors(parsedAuthors.map(author => author.id)); // on ne garde que les id pour envoyer à Sequelize
      }
      
      await book.save();
      res.json({ message: "Livre mis à jour.", book });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du livre." });
    }
  },
}
