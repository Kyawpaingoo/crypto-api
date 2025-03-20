import { Request, Response } from "express";
import { createFailureResponse, createSuccessResponse, createJsonRespone } from "../Helper/JsonResponseHelper";
import prisma from "../prisma";
import { v4 as uuidv4 } from 'uuid';

export const CreateWalletService = async (req: Request, res: Response) : Promise<void> =>
{
    const {walletName, walletType } = req.body;
    const {appID} = req.params;

    try {
        const walletID = uuidv4();

        const checkWalletName = await prisma.tbWallet.findUnique({
            where: {
                walletName: walletName,
                userAppID: appID
            }
        });

        if(checkWalletName != null)
        {
            throw new Error("Wallet name already exist");
        }

        const wallet = await prisma.tbWallet.create({
            data: {
                walletID,
                walletName,
                walletType,
                balance : 0,
                userAppID: appID
            }
        });

        if(wallet == null)
        {
            throw new Error("Failed to create wallet");
        }

        createSuccessResponse(res, wallet);
    }
    catch (error)
    {
        if(error instanceof Error) {
            const statusCode = error.message === "Failed to create wallet" ? 400 : error.message === "Wallet name already exist" ? 400 : 500;
            createFailureResponse(res, error.message, [], statusCode);
        }
    }
}