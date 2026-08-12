/*
  Warnings:

  - You are about to drop the column `admis` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `ecole` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `mention` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Result` table. All the data in the column will be lost.
  - Added the required column `decision` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomFr` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "admis",
DROP COLUMN "ecole",
DROP COLUMN "mention",
DROP COLUMN "nom",
ADD COLUMN     "centreExamenAr" TEXT,
ADD COLUMN     "centreExamenFr" TEXT,
ADD COLUMN     "dateNaissance" TEXT,
ADD COLUMN     "decision" TEXT NOT NULL,
ADD COLUMN     "etablissementAr" TEXT,
ADD COLUMN     "etablissementFr" TEXT,
ADD COLUMN     "lieuNaissanceAr" TEXT,
ADD COLUMN     "lieuNaissanceFr" TEXT,
ADD COLUMN     "nomAr" TEXT,
ADD COLUMN     "nomFr" TEXT NOT NULL,
ADD COLUMN     "wilayaAr" TEXT,
ADD COLUMN     "wilayaFr" TEXT;
