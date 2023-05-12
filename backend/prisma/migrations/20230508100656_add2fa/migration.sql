/*
  Warnings:

  - You are about to drop the column `default` on the `Authenticators` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Authenticators` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Authenticators` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Authenticators` table. All the data in the column will be lost.
  - You are about to drop the column `validate_to` on the `Authenticators` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Authenticators` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Authenticators" DROP COLUMN "default",
DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "type",
DROP COLUMN "validate_to";

-- DropEnum
DROP TYPE "TypeAuth";

-- CreateIndex
CREATE UNIQUE INDEX "Authenticators_user_id_key" ON "Authenticators"("user_id");
