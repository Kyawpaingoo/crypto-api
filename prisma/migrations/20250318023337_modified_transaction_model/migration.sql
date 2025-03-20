/*
  Warnings:

  - You are about to drop the column `wallet_id` on the `tbTransaction` table. All the data in the column will be lost.
  - Added the required column `nature` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_app_id` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_wallet_id` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_app_id` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_wallet_id` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tbTransaction" DROP CONSTRAINT "tbTransaction_wallet_id_fkey";

-- AlterTable
ALTER TABLE "tbTransaction" DROP COLUMN "wallet_id",
ADD COLUMN     "nature" TEXT NOT NULL,
ADD COLUMN     "receiver_app_id" TEXT NOT NULL,
ADD COLUMN     "receiver_wallet_id" TEXT NOT NULL,
ADD COLUMN     "sender_app_id" TEXT NOT NULL,
ADD COLUMN     "sender_wallet_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tbTransaction" ADD CONSTRAINT "tbTransaction_sender_wallet_id_fkey" FOREIGN KEY ("sender_wallet_id") REFERENCES "tbWallet"("walletID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbTransaction" ADD CONSTRAINT "tbTransaction_receiver_wallet_id_fkey" FOREIGN KEY ("receiver_wallet_id") REFERENCES "tbWallet"("walletID") ON DELETE CASCADE ON UPDATE CASCADE;
