-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organization_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "organization" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organization_fkey" FOREIGN KEY ("organization") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
