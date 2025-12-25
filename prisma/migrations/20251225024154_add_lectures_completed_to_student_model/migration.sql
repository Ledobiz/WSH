-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "lecturesCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Student_lecturesCompleted_idx" ON "Student"("lecturesCompleted");
