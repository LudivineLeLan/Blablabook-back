import Router from "express";
import { authAdmin } from "../middleware/authAdmin.js";
import { adminController } from "../controllers/index.js";

export const adminRouter = Router();

adminRouter.get("/users", authAdmin, adminController.getAllUsers);
adminRouter.delete("/users/:id", authAdmin, adminController.deleteUser);

adminRouter.get("/books", authAdmin, adminController.getAllBooks);
adminRouter.delete("/books/:id", authAdmin, adminController.deleteBook);
adminRouter.put("/books/:id", authAdmin, adminController.updateBook);
adminRouter.post("/books/:id/cover", authAdmin, upload.single("cover"), adminController.uploadCover);

