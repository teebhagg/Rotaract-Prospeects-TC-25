-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('CLUB_MEETING');

-- CreateEnum
CREATE TYPE "RepeatPattern" AS ENUM ('NONE', 'EVERYDAY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MemeberType" AS ENUM ('GUEST', 'PROSPECT', 'ROTARACTOR');

-- AlterTable
ALTER TABLE "meeting" ADD COLUMN     "customDays" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "repeat" "RepeatPattern" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "MeetingType" NOT NULL DEFAULT 'CLUB_MEETING';

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "memberType" "MemeberType" NOT NULL DEFAULT 'GUEST';
