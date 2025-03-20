/*
  Warnings:

  - You are about to drop the column `description` on the `tbTransaction` table. All the data in the column will be lost.
  - Added the required column `Title` to the `tbTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbTransaction" DROP COLUMN "description",
ADD COLUMN     "Title" TEXT NOT NULL;
