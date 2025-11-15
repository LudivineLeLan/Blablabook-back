import { Book, Author, Genre } from "../models/index.js";
import { Sequelize, Op } from "sequelize";

export const bookController = {
  async getRandomBooks(req, res) {
    try {
      const books = await Book.findAll({
        order: Sequelize.literal("RANDOM()"),
        limit: 10,
        include: [
          { model: Author, as: "authors", through: { attributes: [] } },
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
      });
      res.json(books);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error });
        
    }
  },

  async getAllBooks(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
      const books = await Book.findAll({
        include: [
          { model: Author, as: "authors", through: { attributes: [] } },
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
        order: [["release_date", "DESC"]],
        limit,
        offset,
      });

      const totalBooks = await Book.count();
      const totalPages = Math.ceil(totalBooks / limit);

      res.json({
        page,
        totalPages,
        totalBooks,
        books,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des livres" });
    }
  },

  async getBookById(req, res) {
    try {
      const book = await Book.findByPk(req.params.id, {
        include: [
          { model: Author, as: "authors", through: { attributes: [] } },
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
      });
      if (!book) return res.status(404).json({ error: "Livre non trouvé" });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async searchBooks(req, res) {
    try {
      const { q, type } = req.query;

      if (!q || q.trim().length < 2) {
        return res.json([]); // on retourne un tableau vide si recherche de moins de 2 caractères
      }

      const searchTerm = q.trim(); //supprime les espaces
      const words = searchTerm.split(/\s+/); //sépare le terme en mots

      let results = [];

      if (!type || type === "title") {
        // Recherche dans les titres
        results = [...results, ...(await Book.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${searchTerm}%` } }
            ]
          },
          include: [{ model: Author, as: "authors" }, { model: Genre, as: "genres" }],
          limit: 10
        }))];
      }

      if (!type || type === "author") {
        // Recherche par auteur
        results = [...results, ...(await Book.findAll({
          include: [
            {
              model: Author,
              as: "authors",
              where: {
                [Op.and]: words.map(word => ({
                  [Op.or]: [
                    { firstname: { [Op.iLike]: `%${word}%` } },
                    { name: { [Op.iLike]: `%${word}%` } }
                  ]
                }))
              }
            },
            { model: Genre, as: "genres" }
          ],
          limit: 10
        }))];
      }

      if (!type || type === "genre") {
        // Recherche par genre
        results = [...results, ...(await Book.findAll({
          include: [
            { model: Author, as: "authors" },
            {
              model: Genre,
              as: "genres",
              where: { name: { [Op.iLike]: `%${searchTerm}%` } }
            }
          ],
          limit: 10
        }))];
      }

      // Dédupliquer : sert à n'afficher qu'une fois un livre qui correspond à plusieurs requêtes 
      const uniqueBooks = results.reduce((uniqueList, book) => {
        if (!uniqueList.find(existingBook => existingBook.id === book.id)) uniqueList.push(book); // si le livre n'existe pas, on l'ajoute
        return uniqueList;
      }, []);

      res.json(uniqueBooks.slice(0, 10));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur recherche" });
    }
  }

};
