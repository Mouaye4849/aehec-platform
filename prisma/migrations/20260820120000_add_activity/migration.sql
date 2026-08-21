-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ACTIVITY', 'EVENT', 'INITIATIVE', 'WORKSHOP', 'ACHIEVEMENT', 'COMMUNITY_PROJECT');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "type" "ActivityType" NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT,
    "descriptionFr" TEXT,
    "descriptionAr" TEXT,
    "imageUrl" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
