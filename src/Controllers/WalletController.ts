import express from 'express';
import { CreateWalletService } from '../Services/WalletService';
import { authMiddleware } from '../Middleware/AuthMiddleware';

const WalletController = express.Router();

WalletController.post('/create/:appID', authMiddleware ,CreateWalletService);

export default WalletController;