/*
  Warnings:

  - You are about to drop the column `textOrder` on the `CharacterStep` table. All the data in the column will be lost.
  - Added the required column `text` to the `CharacterStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterStep" DROP COLUMN "textOrder",
ADD COLUMN     "text" TEXT NOT NULL;
