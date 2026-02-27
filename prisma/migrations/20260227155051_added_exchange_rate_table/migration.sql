-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" VARCHAR(191) NOT NULL,
    "conversionRates" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);
