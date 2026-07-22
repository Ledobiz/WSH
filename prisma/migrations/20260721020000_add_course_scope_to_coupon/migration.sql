-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN "courseId" VARCHAR(191);

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
