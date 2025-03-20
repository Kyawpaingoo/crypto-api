/*
  Warnings:

  - Added the required column `walletType` to the `tbWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbUser" ADD COLUMN     "photo" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dkzjg7z5e/image/upload/v1633660004/avatars/default-avatar.png';

-- AlterTable
ALTER TABLE "tbWallet" ADD COLUMN     "walletType" TEXT NOT NULL;
