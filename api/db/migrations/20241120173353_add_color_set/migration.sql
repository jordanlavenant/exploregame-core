-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "colorSetId" TEXT NOT NULL DEFAULT '1';

-- CreateTable
CREATE TABLE "ColorSet" (
    "id" TEXT NOT NULL,
    "primary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "tertiary" TEXT NOT NULL,

    CONSTRAINT "ColorSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_colorSetId_fkey" FOREIGN KEY ("colorSetId") REFERENCES "ColorSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
