import { Router } from "express";
import { bookController } from '../controllers/index.js';


export const bookRouter = Router();

bookRouter.get('/search', bookController.searchBooks);
bookRouter.get('/', bookController.getRandomBooks);
bookRouter.get('/catalog', bookController.getAllBooks);
bookRouter.get('/book/:id', bookController.getBookById);

