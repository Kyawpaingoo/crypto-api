import express from "express";
import { checkUsernameService, registerService, loginService, refreshTokenService, logoutService } from "../Services/AuthService";

const AuthController = express.Router();

AuthController.post("/register", registerService);
AuthController.post("/checkusername", checkUsernameService);
AuthController.post("/login", loginService);
AuthController.post("/refreshtoken", refreshTokenService);
AuthController.post("/logout", logoutService);

export default AuthController;