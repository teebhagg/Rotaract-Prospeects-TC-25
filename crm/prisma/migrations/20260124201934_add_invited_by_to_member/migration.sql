-- AlterTable
ALTER TABLE "member" ADD COLUMN     "invitedByMemberId" TEXT;

-- CreateIndex
CREATE INDEX "member_invitedByMemberId_idx" ON "member"("invitedByMemberId");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_invitedByMemberId_fkey" FOREIGN KEY ("invitedByMemberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
