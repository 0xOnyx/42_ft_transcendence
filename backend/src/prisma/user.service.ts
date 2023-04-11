import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma} from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async user(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
		include?: Prisma.UserInclude,
	): Promise<Prisma.UserGetPayload<{include : typeof include}> | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
			include: include,
		});
	}
	async userSelect(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
		select: Prisma.UserSelect
	)
	{
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
			select: select
		})
	}
	async Users(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		return this.prisma.user.findMany(params)
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data,
		})
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput
		data: Prisma.UserUpdateInput
	}): Promise<User> {
		const {where, data} = params;
		return this.prisma.user.update({
			data,
			where
		})
	}
	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.delete({
			where,
		})
	}

	async blockUser(user_where: Prisma.UserWhereUniqueInput, user_block: Prisma.UserWhereUniqueInput)
	{
		const data: Prisma.LockUsersCreateInput = {
			user: {connect: user_where},
			lock_user: {connect: user_block},
		}
		return this.prisma.lockUsers.create({data});
	}

	async unblockUser(user_where: Prisma.UserWhereUniqueInput, user_block: Prisma.UserWhereUniqueInput)
	{
		return this.prisma.lockUsers.deleteMany({
			where: {
				user: user_where,
				lock_user: user_block
			},
		});
	}

	async getBlockUserUnique(user_where: Prisma.UserWhereUniqueInput, block_user_where: Prisma.UserWhereUniqueInput)
	{
		return this.prisma.lockUsers.findMany({
			where: {
				user: user_where,
				lock_user: block_user_where
			}
		})
	}

	async getBlockUser(user_where: Prisma.UserWhereUniqueInput, block_user_where: Prisma.UserWhereUniqueInput)
	{
		return this.prisma.lockUsers.findMany({
			where: {
				OR: [
					{
						user: user_where,
						lock_user: block_user_where
					},
					{
						user: block_user_where,
						lock_user: user_where
					}
				]
			}
		})
	}

	getFriend(where: Prisma.FriendWhereUniqueInput)
	{
		return this.prisma.friend.findUnique({
			where: where
		});

	}

	async createFriend(where: Prisma.UserWhereUniqueInput, add_id: Prisma.UserWhereUniqueInput)
	{
		const data: Prisma.FriendCreateInput = {
			request_at: new Date(),
			user: {connect: where},
			friend_user: {connect: add_id},
		}
		return this.prisma.friend.create({data})
	}

	async deleteFriend(where: Prisma.FriendWhereInput, add_id: Prisma.FriendWhereInput)
	{
		await this.prisma.friend.deleteMany({
			where: {
				OR: [
					{ user_id: where.id, friend_id: add_id.id },
					{ user_id: add_id.id, friend_id: where.id },
				],
			},
		});
	}

	async updateFriend(where: Prisma.FriendWhereUniqueInput, data: Prisma.FriendUpdateInput)
	{
		await this.prisma.friend.update({
			where,
			data
		})
	}

}