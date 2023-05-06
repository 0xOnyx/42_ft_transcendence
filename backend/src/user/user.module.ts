import { Module } from '@nestjs/common';
import {UserServiceService} from './user.service';
import { UserProviderController } from './user-provider.controller';
import { UserService } from "../prisma/user.service";

@Module({
    controllers: [UserProviderController],
    providers: [UserServiceService, UserService]
})
export class UserModule {}
