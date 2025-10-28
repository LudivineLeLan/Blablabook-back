import { Genre } from '../models/index.js';


export const genreController = {

  async getAllGenres(req, res) {
    try {
      const genres = await Genre.findAll({});
      res.json(genres);
    } catch (error) {
      res.status(500).json({ error: 'Impossible de récupérer les genres' });
    }
  },

  async getGenreById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: "Format d'ID invalide" });
      }
      const genre = await Genre.findByPk(id);
      if (!genre) {
        return res.status(404).json({ error: "Genre non trouvé. Veuillez vérifier l'ID fourni" });
      }
      res.status(200).json(genre);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};
