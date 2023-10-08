/*
  Warnings:

  - The `access` column on the `Channel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Access" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "access",
ADD COLUMN     "access" "Access" NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");
