/*
  Warnings:

  - You are about to drop the column `receiver_app_id` on the `tbTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_wallet_id` on the `tbTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `sender_app_id` on the `tbTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `sender_wallet_id` on the `tbTransaction` table. All the data in the column will be lost.
  - Added the required column `app_id` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tbTransaction" DROP CONSTRAINT "tbTransaction_receiver_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "tbTransaction" DROP CONSTRAINT "tbTransaction_sender_wallet_id_fkey";

-- AlterTable
ALTER TABLE "tbTransaction" DROP COLUMN "receiver_app_id",
DROP COLUMN "receiver_wallet_id",
DROP COLUMN "sender_app_id",
DROP COLUMN "sender_wallet_id",
ADD COLUMN     "app_id" TEXT NOT NULL,
ADD COLUMN     "transfer_id" INTEGER,
ADD COLUMN     "wallet_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tbTransfer" (
    "id" SERIAL NOT NULL,
    "transferID" TEXT NOT NULL,
    "sender_wallet_id" TEXT NOT NULL,
    "sender_app_id" TEXT NOT NULL,
    "receiver_wallet_id" TEXT NOT NULL,
    "receiver_app_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbTransfer_transferID_key" ON "tbTransfer"("transferID");

-- AddForeignKey
ALTER TABLE "tbTransaction" ADD CONSTRAINT "tbTransaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "tbWallet"("walletID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbTransaction" ADD CONSTRAINT "tbTransaction_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "tbTransfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbTransfer" ADD CONSTRAINT "tbTransfer_sender_wallet_id_fkey" FOREIGN KEY ("sender_wallet_id") REFERENCES "tbWallet"("walletID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbTransfer" ADD CONSTRAINT "tbTransfer_receiver_wallet_id_fkey" FOREIGN KEY ("receiver_wallet_id") REFERENCES "tbWallet"("walletID") ON DELETE CASCADE ON UPDATE CASCADE;
