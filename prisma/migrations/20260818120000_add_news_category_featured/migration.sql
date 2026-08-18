-- AlterTable
ALTER TABLE "News" ADD COLUMN     "categoryFr" TEXT,
ADD COLUMN     "categoryAr" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
