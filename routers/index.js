import { Router } from "express";
import { bookRouter } from "./book.router.js";
import { authorRouter } from "./author.router.js";
import { genreRouter } from "./genre.router.js";
import { userRouter } from "./user.router.js";
import { userbookRouter } from "./userbook.router.js";
import { adminRouter } from "./admin.routes.js";


export const apiRouter = Router();

apiRouter.use(bookRouter);
apiRouter.use(authorRouter);
apiRouter.use(genreRouter);
apiRouter.use(userRouter);
apiRouter.use(userbookRouter);
apiRouter.use("/admin", adminRouter);
