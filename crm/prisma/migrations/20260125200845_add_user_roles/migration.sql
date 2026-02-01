-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MAIN_ADMIN', 'ASSISTANT', 'MEMBER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" DEFAULT 'ASSISTANT';
