/*
  Warnings:

  - Made the column `count_read_messages` on table `RoomUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RoomUser" DROP CONSTRAINT "RoomUser_last_message_read_id_fkey";

-- AlterTable
ALTER TABLE "RoomUser" ALTER COLUMN "last_message_read_id" DROP NOT NULL,
ALTER COLUMN "count_read_messages" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_last_message_read_id_fkey" FOREIGN KEY ("last_message_read_id") REFERENCES "Messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
