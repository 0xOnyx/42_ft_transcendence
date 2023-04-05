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

	async blockUser(where: Prisma.UserWhereUniqueInput, block_id: Prisma.UserWhereUniqueInput)
	{
		const data: Prisma.LockUsersCreateInput = {
			user: {connect: where},
			lock_user: {connect: block_id},
		}
		return this.prisma.lockUsers.create({data});
	}

	async unblockUser(where: Prisma.LockUsersWhereInput, block_id: Prisma.LockUsersWhereInput)
	{
		return this.prisma.lockUsers.deleteMany({
			where: {...where, ...block_id},
		});
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