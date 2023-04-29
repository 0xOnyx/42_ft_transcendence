-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "TypeAuth" AS ENUM ('SMS', 'EMAIL', 'APP');

-- CreateEnum
CREATE TYPE "Log" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_ROOM', 'UPDATE_ROOM');

-- CreateEnum
CREATE TYPE "TypeRoom" AS ENUM ('PUBLIC_ROOM', 'SINGLE_CHAT');

-- CreateEnum
CREATE TYPE "TypeMessage" AS ENUM ('MESSAGE', 'ADD_FRIEND', 'INVITE_GAME');

-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusGame" AS ENUM ('CREATED', 'STARTED', 'FINISHED');

-- CreateEnum
CREATE TYPE "TypeGame" AS ENUM ('STANDARD', 'BLACKHOLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "oauth_42_login" TEXT NOT NULL,
    "oauth_42_id" INTEGER NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL,
    "online_status" "Status" NOT NULL DEFAULT 'OFFLINE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authenticators" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "type" "TypeAuth" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "validate_to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Authenticators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "request_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accept_at" TIMESTAMP(3),

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserState" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "Log" NOT NULL,
    "datas" JSONB NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "type" "TypeRoom" NOT NULL,
    "password" TEXT,
    "count_messages" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message_type" "TypeMessage" NOT NULL,
    "content" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomUser" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "RoleUser" NOT NULL DEFAULT 'USER',
    "ban" BOOLEAN NOT NULL DEFAULT false,
    "mute" BOOLEAN NOT NULL DEFAULT false,
    "term_penalty" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count_read_messages" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockUsers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "lock_user_id" INTEGER NOT NULL,

    CONSTRAINT "LockUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "status" "StatusGame" NOT NULL DEFAULT 'CREATED',
    "player_one_id" INTEGER NOT NULL,
    "player_two_id" INTEGER NOT NULL,
    "player_one_accepted" BOOLEAN NOT NULL DEFAULT false,
    "player_two_accepted" BOOLEAN NOT NULL DEFAULT false,
    "map_type" "TypeGame" NOT NULL DEFAULT 'STANDARD',
    "level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score_one" INTEGER NOT NULL,
    "score_two" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauth_42_login_key" ON "User"("oauth_42_login");

-- CreateIndex
CREATE UNIQUE INDEX "User_oauth_42_id_key" ON "User"("oauth_42_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserState_user_id_key" ON "UserState"("user_id");

-- AddForeignKey
ALTER TABLE "Authenticators" ADD CONSTRAINT "Authenticators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockUsers" ADD CONSTRAINT "LockUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockUsers" ADD CONSTRAINT "LockUsers_lock_user_id_fkey" FOREIGN KEY ("lock_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player_one_id_fkey" FOREIGN KEY ("player_one_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player_two_id_fkey" FOREIGN KEY ("player_two_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
