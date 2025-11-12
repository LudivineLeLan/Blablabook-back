import { Router } from "express";
import { authAdmin } from "../middlewares/authAdmin.js";
import { adminController } from "../controllers/index.js";
import upload from "../middlewares/uploadCover.middleware.js";


export const adminRouter = Router();

adminRouter.get("/users", authAdmin, adminController.getAllUsers);
adminRouter.delete("/users/:id", authAdmin, adminController.deleteUser);
adminRouter.patch("/users/:id", authAdmin, adminController.updateUserRole);
adminRouter.get("/books", authAdmin, adminController.getAllBooks);
adminRouter.delete("/books/:id", authAdmin, adminController.deleteBook);
adminRouter.put("/books/:id", authAdmin,upload.single("cover"), adminController.updateBook);
adminRouter.post("/books", authAdmin, upload.single("cover"), adminController.addBook);


