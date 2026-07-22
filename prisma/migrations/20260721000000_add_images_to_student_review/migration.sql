-- AlterTable
ALTER TABLE "StudentReview" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
