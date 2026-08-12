-- AlterTable
ALTER TABLE "ExecutiveMember" DROP COLUMN "biographie",
DROP COLUMN "nom",
DROP COLUMN "poste",
ADD COLUMN     "biographieAr" TEXT,
ADD COLUMN     "biographieFr" TEXT,
ADD COLUMN     "nomAr" TEXT,
ADD COLUMN     "nomFr" TEXT NOT NULL,
ADD COLUMN     "posteAr" TEXT,
ADD COLUMN     "posteFr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MotivationalMessage" DROP COLUMN "message",
ADD COLUMN     "messageAr" TEXT,
ADD COLUMN     "messageFr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "News" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "contentAr" TEXT,
ADD COLUMN     "contentFr" TEXT NOT NULL,
ADD COLUMN     "excerptAr" TEXT,
ADD COLUMN     "excerptFr" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "titleAr" TEXT,
ADD COLUMN     "titleFr" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" SERIAL NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT,
    "descriptionFr" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "deadline" TIMESTAMP(3),
    "link" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT,
    "descriptionFr" TEXT,
    "descriptionAr" TEXT,
    "category" TEXT,
    "fileUrl" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

