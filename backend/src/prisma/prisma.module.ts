import {Global, Module} from '@nestjs/common';
import { PrismaService } from "./prisma.service";
import { UserService } from "./user.service";
import {Api42Service} from "./api42.service";
import { ActivitylogService } from './activitylog.service';
import { MessageService } from './message.service';
import { PrismaGameService } from './prismagame.service';

@Global()
@Module({
	providers: [PrismaService, UserService, Api42Service, ActivitylogService, MessageService, PrismaGameService],
	exports: [PrismaService]
})
export class PrismaModule {}
