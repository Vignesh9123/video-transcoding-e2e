-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'cmcq3ol2h0000l30vktireo3x';

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
