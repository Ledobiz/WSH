-- CreateEnum
CREATE TYPE "CertificateRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "CertificateRequest" (
    "id" VARCHAR(191) NOT NULL,
    "studentId" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "courseId" VARCHAR(191) NOT NULL,
    "certificateName" VARCHAR(191) NOT NULL,
    "originalName" VARCHAR(191) NOT NULL,
    "signatureUrl" TEXT NOT NULL,
    "signaturePublicId" VARCHAR(255) NOT NULL,
    "status" "CertificateRequestStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" VARCHAR(191),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateRequestFile" (
    "id" VARCHAR(191) NOT NULL,
    "requestId" VARCHAR(191) NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" VARCHAR(255) NOT NULL,
    "resourceType" VARCHAR(16) NOT NULL,
    "bytes" INTEGER,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateRequestFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateRequest_studentId_key" ON "CertificateRequest"("studentId");

-- CreateIndex
CREATE INDEX "CertificateRequest_userId_idx" ON "CertificateRequest"("userId");

-- CreateIndex
CREATE INDEX "CertificateRequest_courseId_idx" ON "CertificateRequest"("courseId");

-- CreateIndex
CREATE INDEX "CertificateRequest_status_idx" ON "CertificateRequest"("status");

-- CreateIndex
CREATE INDEX "CertificateRequest_submittedAt_idx" ON "CertificateRequest"("submittedAt");

-- CreateIndex
CREATE INDEX "CertificateRequestFile_requestId_idx" ON "CertificateRequestFile"("requestId");

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequestFile" ADD CONSTRAINT "CertificateRequestFile_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CertificateRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
