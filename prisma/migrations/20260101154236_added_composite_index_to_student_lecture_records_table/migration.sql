/*
  Warnings:

  - A unique constraint covering the columns `[studentModuleId,studentModuleComponentId]` on the table `StudentLectureRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentLectureRecord_studentModuleId_studentModuleComponent_key" ON "StudentLectureRecord"("studentModuleId", "studentModuleComponentId");
