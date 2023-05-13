/*
  Warnings:

  - The values [STARTED] on the enum `StatusGame` will be removed. If these variants are still used in the database, this will fail.
  - The values [STANDARD] on the enum `TypeGame` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusGame_new" AS ENUM ('CREATED', 'READY', 'INIT', 'WAIT', 'RUN', 'LOST', 'FINISHED');
ALTER TABLE "Game" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "status" TYPE "StatusGame_new" USING ("status"::text::"StatusGame_new");
ALTER TYPE "StatusGame" RENAME TO "StatusGame_old";
ALTER TYPE "StatusGame_new" RENAME TO "StatusGame";
DROP TYPE "StatusGame_old";
ALTER TABLE "Game" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TypeGame_new" AS ENUM ('CLASSIC', 'BLACKHOLE');
ALTER TABLE "Game" ALTER COLUMN "map_type" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "map_type" TYPE "TypeGame_new" USING ("map_type"::text::"TypeGame_new");
ALTER TYPE "TypeGame" RENAME TO "TypeGame_old";
ALTER TYPE "TypeGame_new" RENAME TO "TypeGame";
DROP TYPE "TypeGame_old";
ALTER TABLE "Game" ALTER COLUMN "map_type" SET DEFAULT 'CLASSIC';
COMMIT;

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player_two_id_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "player_two_id" DROP NOT NULL,
ALTER COLUMN "map_type" SET DEFAULT 'CLASSIC',
ALTER COLUMN "level" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player_two_id_fkey" FOREIGN KEY ("player_two_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
