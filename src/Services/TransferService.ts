import { Request, Response } from "express";
import prisma from "../prisma";
import { createFailureResponse, createSuccessResponse, createJsonRespone } from "../Helper/JsonResponseHelper";
import { v4 as uuidv4 } from 'uuid';
import { createTransferDto } from '../Dtos/TransferDto';
import { createTransactionDto } from '../Dtos/TransactionDto';

export const TransferService = async (req: Request, res: Response): Promise<void> => {
    const { senderAppId, senderWalletId, receiverAppId, receiverWalletId, amount, currency, description } = req.body;

    try {
        if (parseFloat(amount) <= 0) {
            throw new Error("Transfer amount must be greater than zero");
        }

        await prisma.$transaction(async (txt) => {
            const senderUser = await findUser(txt, senderAppId, "Sender");
            const receiverUser = await findUser(txt, receiverAppId, "Receiver");

            const senderWallet = await findWallet(txt, senderWalletId, senderAppId, "Sender");

            const receiverWallet = await findWallet(txt, receiverWalletId, receiverAppId, "Receiver");

            if (senderWallet.balance < amount) {
                throw new Error("Insufficient balance in sender's wallet");
            }

            const transferDto: createTransferDto = {
                transferID: uuidv4(),
                senderAppId,
                receiverAppId,
                senderWalletId,
                receiverWalletId,
                amount: parseFloat(amount),
                currency,
                description,
                status: "completed",
                createdAt: new Date()
            }

            const transfer = await createTransferRecord(txt, transferDto);

            const senderTransaction: createTransactionDto = {
                transactionID: uuidv4(),
                Title: `Sent to Wallet: ${receiverWalletId}`,
                walletID: senderWalletId,
                appID: senderAppId,
                transferID: transfer.id,
                nature: "negative",
                type: "transfer",
                amount: parseFloat(amount),
                currency,
                createdAt: new Date()
            };
            await createTransactionRecord(txt, senderTransaction);

            const receiverTransaction: createTransactionDto = {
                transactionID: uuidv4(),
                walletID: receiverWalletId,
                appID: receiverAppId,
                transferID: transfer.id,
                nature: "positive",
                type: "transfer",
                amount: parseFloat(amount),
                currency,
                Title: `Received from Wallet: ${senderWalletId}`,
                createdAt: new Date()
            };
            await createTransactionRecord(txt, receiverTransaction);

            await updateWalletBalances(txt, senderWalletId, receiverWalletId, parseFloat(amount));

            createSuccessResponse(res, transfer, `Transfer of ${amount} ${currency} from ${senderWalletId} to ${receiverWalletId} completed successfully`);
        });

    } catch (error) {
        if (error instanceof Error) {
            handleTransferError(res, error, { senderAppId, senderWalletId, receiverAppId, receiverWalletId, amount });
        }
    }
};

async function findUser(txt: any, appID: string, userType: string) {
    const user = await txt.tbUser.findUnique({
        where: { appID }
    });

    if (!user) {
        throw new Error(`${userType} not found`);
    }

    return user;
}

async function findWallet(txt: any, walletId: string, appId: string, walletType: string) {
    const wallet = await txt.tbWallet.findFirst({
        where: {
            walletID: walletId,
            userAppID: appId
        }
    });

    if (!wallet) {
        throw new Error(`${walletType} wallet ${walletId} not found or doesn't belong to user ${appId}`);
    }

    return wallet;
}

async function createTransferRecord(txt: any, transferData: createTransferDto) {
    return await txt.tbTransfer.create({ data: transferData });
}

async function createTransactionRecord(txt: any, transactionData: createTransactionDto) {
    return await txt.tbTransaction.create({ data: transactionData });
}

async function updateWalletBalances(txt: any, senderWalletId: string, receiverWalletId: string, amount: number) {
    await txt.tbWallet.update({
        where: { walletID: senderWalletId },
        data: { balance: { decrement: amount } }
    });

    await txt.tbWallet.update({
        where: { walletID: receiverWalletId },
        data: { balance: { increment: amount } }
    });
}

function handleTransferError(res: Response, error: any, params: any) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    let statusCode = 500;

    if (errorMessage.includes("must be greater than zero")) {
        statusCode = 400;
    } else if (errorMessage.includes("not found")) {
        statusCode = 404;
    } else if (errorMessage.includes("Insufficient balance")) {
        statusCode = 400;
    }

    createFailureResponse(res, errorMessage, [], statusCode);
}