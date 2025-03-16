/*
  Warnings:

  - You are about to drop the column `user_id` on the `tbWallet` table. All the data in the column will be lost.
  - Added the required column `user_app_id` to the `tbWallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tbWallet" DROP CONSTRAINT "tbWallet_user_id_fkey";

-- AlterTable
ALTER TABLE "tbWallet" DROP COLUMN "user_id",
ADD COLUMN     "user_app_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tbWallet" ADD CONSTRAINT "tbWallet_user_app_id_fkey" FOREIGN KEY ("user_app_id") REFERENCES "tbUser"("appID") ON DELETE CASCADE ON UPDATE CASCADE;
