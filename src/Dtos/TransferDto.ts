export type createTransferDto = {
    transferID: String,
    senderAppId: String,
    receiverAppId: String,
    senderWalletId: String,
    receiverWalletId: String,
    amount: Number,
    currency: String,
    description: String,
    status: String,
    createdAt: Date,
}