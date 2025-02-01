/*
  Warnings:

  - You are about to drop the `BDE` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BDE" DROP CONSTRAINT "BDE_departmentId_fkey";

-- DropTable
DROP TABLE "BDE";

-- CreateTable
CREATE TABLE "Bde" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "Bde_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bde" ADD CONSTRAINT "Bde_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
