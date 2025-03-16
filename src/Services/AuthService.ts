import e, { Request, Response } from 'express';
import { createFailureResponse, createSuccessResponse } from '../Helper/JsonResponseHelper';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import SendEmail from './EmailService';
import EmailDto from '../Dtos/EmailDto';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userPayload } from 'src/Dtos/AuthDto';
import { UserProfileDto } from 'src/Dtos/UserDto';

const jwtSecret: string = process.env.JWT_SECRET as string;

export const registerService = async (req: Request, res: Request) : Promise<void> => {
    const { email, password, username } = req.body;

    try {
        

        if(!email || !password) {
            throw new Error("Email and password are required");
            
        }

        const existingUser = await prisma.tbUser.findFirst({
            where: {email: email}
        });

        if(existingUser) {
            throw new Error("User already exists");
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        const appID = uuidv4();

        const user = await prisma?.tbUser.create({
            data: {
                appID,
                username,
                email,
                password: hasedPassword
            }
        });

        if(!user) {
            throw new Error("User registration failed");
        }

        const emailDto: EmailDto = {
            receiver: user.email,
            subject: "Registration successful",
            text: "Welcome to our platform"
        }
        
        await SendEmail(emailDto);

        const result: UserProfileDto = {
            appID: user.appID,
            username: user.username,
            email: user.email
        }

        createSuccessResponse(res, result, "User registration successful");
    }
    catch (error) {
        if(error instanceof Error) {
            const statusCode = 
                error.message === "Email and password are required" || 
                error.message === "User already exists" || 
                error.message === "Username already exists" || 
                error.message === "User registration failed" 
                    ? 400 : 500;
            createFailureResponse(res, error.message, [], 400);
        }

        if(error instanceof Error) {
            createFailureResponse(res, error.message, [], 500);
        }
    }
}

export const checkUsernameService  = async (req: Request, res: Response) : Promise<void> => {

    const { username } = req.body;
    try {
        if (!username) {
            throw new Error( "Username is required");
        }
    
        const existingUsername = await prisma.tbUser.findUnique({
            where: {
                username: username
            }
        });
    
        if(existingUsername) {
            createFailureResponse(res, "Username already exists", [], 400);
            return;
        }

        createSuccessResponse(res, null, "Username available");
    }
    catch (error)
    {
        if(error instanceof Error) {
            const statusCode = 
                error.message === "Username is required" 
                    ? 400 : 500;
            createFailureResponse(res, error.message, [], 400);
        }
    }
    
}

export const loginService = async (req: Request, res: Response) : Promise<void> => {
    const {email, password} = req.body;

    try{
        if(!email || !password) 
        {
            throw new Error("Email and password are required");
        }

        const user = await prisma.tbUser.findUnique({
            where: {
                email: email
            }
        }); 

        if(!user)
        {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
        {
            throw new Error("Invalid password");
        }

        const userPayload: userPayload = {
            appID: user.appID,
            password: user.password
        }

        const token = generateToken(userPayload, 3600);
        const refreshToken = generateToken(userPayload, 86400);
        res.cookie("token", token, {httpOnly: true});
        res.cookie("refreshToken", refreshToken, {httpOnly: true});

        const result: UserProfileDto = {
            appID: user.appID,
            username: user.username,
            email: user.email
        }

        createSuccessResponse(res, result, "User logged in successfully");
    }
    catch(error)
    {
        if(error instanceof Error) {
            const statusCode = 
                error.message === "Email and password are required" || 
                error.message === "User not found" || 
                error.message === "Invalid password" 
                    ? 400 : 500;
            createFailureResponse(res, error.message, [], 400);
        }
    }
}

export const refreshTokenService = async (req: Request, res: Response) : Promise<void> => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            throw new Error("Unauthorized");
        }

        const decoded = jwt.verify(refreshToken, jwtSecret) as userPayload;
        const newToken = generateToken(decoded, 3600);
        res.cookie("token", newToken, {httpOnly: true});
        res.json({token: newToken});
    }
    catch(error)
    {
        if(error instanceof Error) {
            const statusCode = 
                error.message === "Unauthorized" 
                    ? 401 : 500;
            createFailureResponse(res, error.message, [], statusCode);
        }
    }
}

const generateToken = (userPayload: userPayload, expiresIn:number): string => {
    const token =  jwt.sign(userPayload, jwtSecret, {expiresIn: expiresIn});
    return token;
}