/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountedFee` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFee` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_isPublished_idx";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isPublished",
DROP COLUMN "price",
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "discountedFee" INTEGER NOT NULL,
ADD COLUMN     "isActive" BOOLEAN DEFAULT true,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalFee" INTEGER NOT NULL,
ADD COLUMN     "previewVideo" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" VARCHAR(191),
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "whoIsCourseFor" TEXT;

-- CreateIndex
CREATE INDEX "Cart_createdAt_idx" ON "Cart"("createdAt");

-- CreateIndex
CREATE INDEX "CartItem_createdAt_idx" ON "CartItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_createdAt_idx" ON "Category"("createdAt");

-- CreateIndex
CREATE INDEX "Coupon_createdAt_idx" ON "Coupon"("createdAt");

-- CreateIndex
CREATE INDEX "Course_isActive_idx" ON "Course"("isActive");

-- CreateIndex
CREATE INDEX "CourseModule_createdAt_idx" ON "CourseModule"("createdAt");

-- CreateIndex
CREATE INDEX "ModuleComponent_createdAt_idx" ON "ModuleComponent"("createdAt");

-- CreateIndex
CREATE INDEX "Student_createdAt_idx" ON "Student"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Wishlist_createdAt_idx" ON "Wishlist"("createdAt");
