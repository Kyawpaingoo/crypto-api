import express from 'express';
import { TransferService } from '../Services/TransferService';
import { authMiddleware } from '../Middleware/AuthMiddleware';

const TransferController = express.Router();

TransferController.post('/maketransfer', authMiddleware, TransferService);
export default TransferController;