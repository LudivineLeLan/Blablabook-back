import { jest, test } from '@jest/globals';
import { authorController } from './author.controller.js';
import { Author } from '../models/index.js';

// on va tester la methode getAllAuthors
describe('authorController.getAllAuthors', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  }); // ici la même chose que pour notre bookController, on réinitialise les mocks

  test('retourne la liste de tous les auteurs', async () => {
    jest.spyOn(Author, 'findAll').mockResolvedValue([
      { id: 1, name: "Auteur 1" },
      { id: 2, name: "Auteur 2" },
      { id: 3, name: "Auteur 3" }
    ]); // on simule la méthode findAll de Author pour qu'elle retourne deux auteurs

    const req = {
      session: {},
    };
    const res = {
      json: jest.fn()
    }; // on simule la méthode res.json pour capturer la réponse

    await authorController.getAllAuthors(req, res); // on appelle la méthode à tester

    expect(Author.findAll).toHaveBeenCalled(); // on vérifie que findAll a bien été appelée
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Auteur 1" },
      { id: 2, name: "Auteur 2" },
      { id: 3, name: "Auteur 3" }
    ]); // on vérifie que res.json a été appelée avec le bon tableau (sans enveloppe dans un objet)
  });
});