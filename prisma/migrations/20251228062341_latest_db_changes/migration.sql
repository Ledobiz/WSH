/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "lastLectureId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "first4Digits" SET DATA TYPE VARCHAR(8),
ALTER COLUMN "last4Digits" SET DATA TYPE VARCHAR(8);

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_courseId_key" ON "Student"("userId", "courseId");
