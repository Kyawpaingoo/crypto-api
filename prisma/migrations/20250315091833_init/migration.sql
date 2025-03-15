-- CreateTable
CREATE TABLE "tbUser" (
    "id" SERIAL NOT NULL,
    "appID" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbWallet" (
    "id" SERIAL NOT NULL,
    "walletID" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbTransaction" (
    "id" SERIAL NOT NULL,
    "transactionID" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbCryptocurrency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "priceUSD" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbCryptocurrency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_appID_key" ON "tbUser"("appID");

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_username_key" ON "tbUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_email_key" ON "tbUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbWallet_walletID_key" ON "tbWallet"("walletID");

-- CreateIndex
CREATE UNIQUE INDEX "tbTransaction_transactionID_key" ON "tbTransaction"("transactionID");

-- CreateIndex
CREATE UNIQUE INDEX "tbCryptocurrency_name_key" ON "tbCryptocurrency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbCryptocurrency_symbol_key" ON "tbCryptocurrency"("symbol");

-- AddForeignKey
ALTER TABLE "tbWallet" ADD CONSTRAINT "tbWallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbUser"("appID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbTransaction" ADD CONSTRAINT "tbTransaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "tbWallet"("walletID") ON DELETE CASCADE ON UPDATE CASCADE;
