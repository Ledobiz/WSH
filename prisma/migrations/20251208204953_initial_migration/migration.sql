-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'admin');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('video', 'file');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'success', 'failed');

-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('website', 'manual', 'app');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191),
    "email" VARCHAR(191) NOT NULL,
    "password" VARCHAR(191),
    "image" TEXT NULL,
    "phone" VARCHAR(191),
    "uid" VARCHAR(191),
    "role" "UserRole" NOT NULL DEFAULT 'student',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" VARCHAR(191) NOT NULL,
    "title" VARCHAR(191) NOT NULL,
    "description" TEXT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "isPublished" BOOLEAN DEFAULT false,
    "categoryId" VARCHAR(191) NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseModule" (
    "id" VARCHAR(191) NOT NULL,
    "courseId" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sorting" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleComponent" (
    "id" VARCHAR(191) NOT NULL,
    "courseModuleId" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "ComponentType" NOT NULL DEFAULT 'video',
    "vimeoVideoUrl" TEXT NULL,
    "embedVideoUrl" TEXT NULL,
    "fileName" TEXT NULL,
    "isPrerequisite" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "sorting" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "slug" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "isPaid" BOOLEAN DEFAULT false,
    "transactionReference" VARCHAR(191),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" VARCHAR(191) NOT NULL,
    "cartId" VARCHAR(191) NOT NULL,
    "courseId" VARCHAR(191) NOT NULL,
    "couponId" VARCHAR(191),
    "price" INTEGER NOT NULL,
    "currency" VARCHAR(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" VARCHAR(191) NOT NULL,
    "code" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191),
    "description" TEXT NULL,
    "maxUse" INTEGER NOT NULL,
    "totalUsed" INTEGER NOT NULL,
    "isFixedAmount" BOOLEAN NOT NULL DEFAULT false,
    "discountAmount" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "courseId" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "reference" VARCHAR(191) NOT NULL,
    "gateway" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NULL,
    "email" VARCHAR(191) NULL,
    "phone" VARCHAR(191) NULL,
    "currency" VARCHAR(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "first4Digits" VARCHAR(4) NULL,
    "last4Digits" VARCHAR(4) NULL,
    "cardBrand" VARCHAR(191) NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "confirmationSent" TIMESTAMP(3),
    "paymentSource" "PaymentSource" NOT NULL DEFAULT 'website',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "courseId" VARCHAR(191) NOT NULL,
    "courseContentAssigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_uid_idx" ON "User"("uid");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_slug_idx" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_isPublished_idx" ON "Course"("isPublished");

-- CreateIndex
CREATE INDEX "Course_createdAt_idx" ON "Course"("createdAt");

-- CreateIndex
CREATE INDEX "CourseModule_isActive_idx" ON "CourseModule"("isActive");

-- CreateIndex
CREATE INDEX "CourseModule_sorting_idx" ON "CourseModule"("sorting");

-- CreateIndex
CREATE INDEX "ModuleComponent_isActive_idx" ON "ModuleComponent"("isActive");

-- CreateIndex
CREATE INDEX "ModuleComponent_sorting_idx" ON "ModuleComponent"("sorting");

-- CreateIndex
CREATE INDEX "Cart_isPaid_idx" ON "Cart"("isPaid");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_endDate_idx" ON "Coupon"("endDate");

-- CreateIndex
CREATE INDEX "Coupon_isActive_idx" ON "Coupon"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE INDEX "Transaction_reference_idx" ON "Transaction"("reference");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Student_courseContentAssigned_idx" ON "Student"("courseContentAssigned");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleComponent" ADD CONSTRAINT "ModuleComponent_courseModuleId_fkey" FOREIGN KEY ("courseModuleId") REFERENCES "CourseModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_transactionReference_fkey" FOREIGN KEY ("transactionReference") REFERENCES "Transaction"("reference") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
