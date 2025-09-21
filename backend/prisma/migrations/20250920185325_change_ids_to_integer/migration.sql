/*
  Warnings:

  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `proposal_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `proposal_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `proposals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `proposals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `rfp_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `rfp_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `rfps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `rfps` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `projectId` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `proposalId` on the `proposal_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rfpItemId` on the `proposal_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `supplierId` on the `proposals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rfpId` on the `proposals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rfpId` on the `rfp_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `rfp_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `projectId` on the `rfps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_customerId_fkey";

-- DropForeignKey
ALTER TABLE "proposal_items" DROP CONSTRAINT "proposal_items_proposalId_fkey";

-- DropForeignKey
ALTER TABLE "proposal_items" DROP CONSTRAINT "proposal_items_rfpItemId_fkey";

-- DropForeignKey
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_rfpId_fkey";

-- DropForeignKey
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "rfp_items" DROP CONSTRAINT "rfp_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "rfp_items" DROP CONSTRAINT "rfp_items_rfpId_fkey";

-- DropForeignKey
ALTER TABLE "rfps" DROP CONSTRAINT "rfps_projectId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "projectId",
ADD COLUMN     "projectId" INTEGER NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "proposal_items" DROP CONSTRAINT "proposal_items_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "proposalId",
ADD COLUMN     "proposalId" INTEGER NOT NULL,
DROP COLUMN "rfpItemId",
ADD COLUMN     "rfpItemId" INTEGER NOT NULL,
ADD CONSTRAINT "proposal_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "proposals" DROP CONSTRAINT "proposals_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "supplierId",
ADD COLUMN     "supplierId" INTEGER NOT NULL,
DROP COLUMN "rfpId",
ADD COLUMN     "rfpId" INTEGER NOT NULL,
ADD CONSTRAINT "proposals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "rfp_items" DROP CONSTRAINT "rfp_items_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "rfpId",
ADD COLUMN     "rfpId" INTEGER NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "rfp_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "rfps" DROP CONSTRAINT "rfps_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "projectId",
ADD COLUMN     "projectId" INTEGER NOT NULL,
ADD CONSTRAINT "rfps_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfps" ADD CONSTRAINT "rfps_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfp_items" ADD CONSTRAINT "rfp_items_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "rfps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfp_items" ADD CONSTRAINT "rfp_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "rfps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_items" ADD CONSTRAINT "proposal_items_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_items" ADD CONSTRAINT "proposal_items_rfpItemId_fkey" FOREIGN KEY ("rfpItemId") REFERENCES "rfp_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
