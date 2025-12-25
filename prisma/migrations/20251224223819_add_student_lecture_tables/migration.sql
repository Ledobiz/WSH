-- CreateEnum
CREATE TYPE "LectureStatus" AS ENUM ('pending', 'ongoing', 'completed');

-- CreateTable
CREATE TABLE "StudentModule" (
    "id" VARCHAR(191) NOT NULL,
    "studentId" VARCHAR(191) NOT NULL,
    "courseModuleId" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sorting" INTEGER,
    "totalDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentModuleComponent" (
    "id" VARCHAR(191) NOT NULL,
    "studentId" VARCHAR(191) NOT NULL,
    "studentModuleId" VARCHAR(191) NOT NULL,
    "moduleComponentId" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "ComponentType" NOT NULL DEFAULT 'video',
    "vimeoVideoUrl" TEXT,
    "embedVideoUrl" TEXT,
    "fileName" TEXT,
    "fileNamePublicId" TEXT,
    "isPrerequisite" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "sorting" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentModuleComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentLectureRecord" (
    "id" VARCHAR(191) NOT NULL,
    "studentModuleId" VARCHAR(191) NOT NULL,
    "studentModuleComponentId" VARCHAR(191) NOT NULL,
    "status" "LectureStatus" NOT NULL DEFAULT 'pending',
    "didYouUnderstand" BOOLEAN NOT NULL DEFAULT false,
    "suggestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentLectureRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentModule_isActive_idx" ON "StudentModule"("isActive");

-- CreateIndex
CREATE INDEX "StudentModule_sorting_idx" ON "StudentModule"("sorting");

-- CreateIndex
CREATE INDEX "StudentModule_createdAt_idx" ON "StudentModule"("createdAt");

-- CreateIndex
CREATE INDEX "StudentModule_deletedAt_idx" ON "StudentModule"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentModuleComponent_isActive_idx" ON "StudentModuleComponent"("isActive");

-- CreateIndex
CREATE INDEX "StudentModuleComponent_sorting_idx" ON "StudentModuleComponent"("sorting");

-- CreateIndex
CREATE INDEX "StudentModuleComponent_createdAt_idx" ON "StudentModuleComponent"("createdAt");

-- CreateIndex
CREATE INDEX "StudentModuleComponent_deletedAt_idx" ON "StudentModuleComponent"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentLectureRecord_status_idx" ON "StudentLectureRecord"("status");

-- CreateIndex
CREATE INDEX "StudentLectureRecord_createdAt_idx" ON "StudentLectureRecord"("createdAt");

-- CreateIndex
CREATE INDEX "StudentLectureRecord_deletedAt_idx" ON "StudentLectureRecord"("deletedAt");

-- AddForeignKey
ALTER TABLE "StudentModule" ADD CONSTRAINT "StudentModule_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentModule" ADD CONSTRAINT "StudentModule_courseModuleId_fkey" FOREIGN KEY ("courseModuleId") REFERENCES "CourseModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentModuleComponent" ADD CONSTRAINT "StudentModuleComponent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentModuleComponent" ADD CONSTRAINT "StudentModuleComponent_studentModuleId_fkey" FOREIGN KEY ("studentModuleId") REFERENCES "StudentModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentModuleComponent" ADD CONSTRAINT "StudentModuleComponent_moduleComponentId_fkey" FOREIGN KEY ("moduleComponentId") REFERENCES "ModuleComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLectureRecord" ADD CONSTRAINT "StudentLectureRecord_studentModuleId_fkey" FOREIGN KEY ("studentModuleId") REFERENCES "StudentModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLectureRecord" ADD CONSTRAINT "StudentLectureRecord_studentModuleComponentId_fkey" FOREIGN KEY ("studentModuleComponentId") REFERENCES "StudentModuleComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
