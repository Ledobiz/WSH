-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "hasCertificate" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "StudentReview" (
    "id" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "studentId" VARCHAR(191) NOT NULL,
    "courseId" VARCHAR(191) NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reply" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "replyDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentReview_createdAt_idx" ON "StudentReview"("createdAt");

-- CreateIndex
CREATE INDEX "StudentReview_isApproved_idx" ON "StudentReview"("isApproved");

-- CreateIndex
CREATE INDEX "StudentReview_isReviewed_idx" ON "StudentReview"("isReviewed");

-- AddForeignKey
ALTER TABLE "StudentReview" ADD CONSTRAINT "StudentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentReview" ADD CONSTRAINT "StudentReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentReview" ADD CONSTRAINT "StudentReview_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
