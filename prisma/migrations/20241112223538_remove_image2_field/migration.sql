/*
  Warnings:

  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_materialId_fkey";

-- DropTable
DROP TABLE "Analysis";

-- DropTable
DROP TABLE "Material";

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "image1_gray" TEXT NOT NULL,
    "image1_iso_grade" DOUBLE PRECISION NOT NULL,
    "image1_avg_gray" DOUBLE PRECISION NOT NULL,
    "image1_resolution" TEXT NOT NULL,
    "image2_gray" TEXT NOT NULL,
    "image2_iso_grade" DOUBLE PRECISION NOT NULL,
    "image2_avg_gray" DOUBLE PRECISION NOT NULL,
    "image2_resolution" TEXT NOT NULL,
    "difference_grade" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "materials_name_key" ON "materials"("name");

-- CreateIndex
CREATE INDEX "analyses_created_at_idx" ON "analyses"("created_at");

-- CreateIndex
CREATE INDEX "analyses_material_id_idx" ON "analyses"("material_id");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
