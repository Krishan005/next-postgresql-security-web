-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Chart" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartData" (
    "id" SERIAL NOT NULL,
    "chartId" TEXT NOT NULL,
    "NVAA" TEXT NOT NULL,
    "VAA" TEXT NOT NULL,
    "SVAA" TEXT NOT NULL,
    "UNB" TEXT NOT NULL,
    "TOTAL" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chart_chartId_key" ON "Chart"("chartId");

-- CreateIndex
CREATE UNIQUE INDEX "ChartData_chartId_key" ON "ChartData"("chartId");
