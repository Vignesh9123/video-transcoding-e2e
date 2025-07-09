-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organization" TEXT NOT NULL DEFAULT 'cmcvo2eai0000gu0vqpm1k64v',
ADD COLUMN     "roleInOrg" "Role" NOT NULL DEFAULT 'VIEWER';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "organization" TEXT NOT NULL DEFAULT 'cmcvo2eai0000gu0vqpm1k64v';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organization_fkey" FOREIGN KEY ("organization") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_organization_fkey" FOREIGN KEY ("organization") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
