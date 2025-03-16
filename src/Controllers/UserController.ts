import express from 'express';
import { getUserProfileService, updateUserProfileService } from '../Services/UserService';
import { authMiddleware } from '../Middleware/AuthMiddleware';

const UserController = express.Router();

UserController.get("/getuserprofile/:appID", authMiddleware, getUserProfileService);
UserController.put("/updateuserprofile/:appID", authMiddleware, updateUserProfileService);

export default UserController;