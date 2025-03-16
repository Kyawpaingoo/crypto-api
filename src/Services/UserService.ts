import { Request, Response } from "express";
import { createFailureResponse, createSuccessResponse, createJsonRespone } from "../Helper/JsonResponseHelper";
import prisma from "../prisma";
import { UpdateUserProfileDto, UserProfileDto } from '../Dtos/UserDto';

export const getUserProfileService = async (req: Request, res: Response) : Promise<void> => 
{
    const {appID} = req.params;
    try{
        const user = await prisma.tbUser.findUnique({
            where: {
                appID: appID
            }
        });

        if(!user)
        {
            throw new Error("User not found");
        }

        const result: UserProfileDto = {
            appID: user.appID,
            username: user.username,
            email: user.email
        }

        createJsonRespone(res, result);
    }
    catch(error)
    {
        if(error instanceof Error) {
            const statusCode = error.message === "User not found" ? 404 : 500;
            createFailureResponse(res, error.message, [], statusCode);
        }
    }
}

export const updateUserProfileService = async (req: Request, res: Response) : Promise<void> =>
{
    const { username, email } = req.body;
    const {appID} = req.params;

    try {
        const user = await prisma.tbUser.findUnique({
            where: {
                appID: appID
            }
        });

        if(!user)
        {
            throw new Error("User not found");
        }

        const updateUserProfileDto: UpdateUserProfileDto = {
            ...(username && { username }),
            ...(email && { email }),
        };

        if (Object.keys(updateUserProfileDto).length === 0) {
            throw new Error("No fields provided for update");
        }

        const updatedUser = await prisma.tbUser.update({
            where: {
                appID: appID
            },
            data: updateUserProfileDto
        });

        if(!updatedUser)
        {
            throw new Error("User Update failed");
        }

        const result: UserProfileDto = {
            appID: updatedUser.appID,
            username: updatedUser.username,
            email: updatedUser.email
        }

        createSuccessResponse(res, result, "Successfully updated user profile");
    }

    catch(error)
    {
        if(error instanceof Error) {
            const statusCode = error.message === "User not found" ? 404 : 
                                error.message === "User Update failed" ? 400 :
                                error.message === "No fields provided for update" ? 400 : 500;
            createFailureResponse(res, error.message, [], statusCode);
        }
    }
}