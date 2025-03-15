import express from "express";
import { checkUsernameService, registerService, loginService, refreshTokenService } from "../Services/AuthService";
import { log } from "console";

const AuthController = express.Router();

AuthController.post("/register", registerService);
AuthController.post("/checkusername", checkUsernameService);
AuthController.post("/login", loginService);
AuthController.post("/refreshtoken", refreshTokenService);

export default AuthController;