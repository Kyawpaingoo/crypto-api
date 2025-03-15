import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    try{
        if (!token) {
            throw new Error("Unauthorized");
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        if(!decoded) {
            throw new Error("Unauthorized");
        }
        next();
    }
    catch(error)
    {
        if(error instanceof Error) {
            const statusCode = 
                error.message === "Unauthorized" 
                    ? 401 : 500;
            res.status(statusCode).json({message: error.message});
        }
    }
}