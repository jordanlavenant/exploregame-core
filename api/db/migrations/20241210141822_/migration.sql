-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "nomPerso" TEXT NOT NULL,
    "descriptionL" TEXT,
    "image" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStep" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "textOrder" INTEGER NOT NULL,

    CONSTRAINT "CharacterStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacterStep" ADD CONSTRAINT "CharacterStep_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStep" ADD CONSTRAINT "CharacterStep_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
