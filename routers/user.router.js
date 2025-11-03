import { Router } from "express";
import { userController } from "../controllers/index.js";
import { userAuthentificationController } from "../controllers/index.js";
import { authenticate } from '../middlewares/authentification.middleware.js';
import avatarUpload from "../middlewares/uploadAvatar.middleware.js";
// import upload from "../middlewares/uploadCover.middleware.js";

export const userRouter = Router();

userRouter.post('/user/register', avatarUpload.single('avatar'), userAuthentificationController.register);

userRouter.post('/user/login', userAuthentificationController.login);

userRouter.get('/auth/me', authenticate, userAuthentificationController.getMe);

userRouter.post('/user', userController.createUser);

userRouter.get('/users', userController.getUsers);

userRouter.get('/user/:id', userController.getUserById);

userRouter.delete('/user/:id', authenticate, userController.deleteUser);

userRouter.patch('/user/:id', authenticate, avatarUpload.single('avatar'), userController.editUserAccount);

userRouter.get("/confirm/:token", userAuthentificationController.confirmAccount);

userRouter.post("/forgot-password", userAuthentificationController.forgotPassword);

userRouter.post("/reset-password/:token", userAuthentificationController.resetPassword);

