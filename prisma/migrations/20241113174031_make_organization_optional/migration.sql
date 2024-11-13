-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_organization_id_fkey";

-- AlterTable
ALTER TABLE "materials" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
