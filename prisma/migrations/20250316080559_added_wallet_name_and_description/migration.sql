/*
  Warnings:

  - A unique constraint covering the columns `[walletName]` on the table `tbWallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletName` to the `tbWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbTransaction" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tbWallet" ADD COLUMN     "walletName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbWallet_walletName_key" ON "tbWallet"("walletName");
