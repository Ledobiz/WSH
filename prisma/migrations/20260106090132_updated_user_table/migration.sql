-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" VARCHAR(191),
ADD COLUMN     "country" VARCHAR(191),
ADD COLUMN     "gender" "UserGender" NOT NULL DEFAULT 'female',
ADD COLUMN     "state" VARCHAR(191);
