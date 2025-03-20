export type createTransactionDto = {
    transactionID: String,
    Title: String,
    walletID: String,
    appID: String,
    transferID?: Number,
    nature: String,
    type: String,
    amount: Number,
    currency: String,
    createdAt: Date
}