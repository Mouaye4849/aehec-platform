-- CreateTable
CREATE TABLE "ExecutiveMember" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "photoUrl" TEXT,
    "biographie" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutiveMember_pkey" PRIMARY KEY ("id")
);
