-- CreateTable
CREATE TABLE "Acronym" (
    "id" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,

    CONSTRAINT "Acronym_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acronym_acronym_key" ON "Acronym"("acronym");
