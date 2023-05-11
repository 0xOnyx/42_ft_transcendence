import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from "../prisma/prisma.module";
import { OauthStrategy } from "./strategies/oauth.strategy";
import { Api42Service } from "../prisma/api42.service";
import { UserService } from "../prisma/user.service";
import { ActivitylogService } from "../prisma/activitylog.service";
import { SessionSerializer } from "./session.serializer";
import {LocalStrategy} from "./strategies/local.strategy";
import {TotpStrategy} from "./strategies/totp.strategy";

@Module({
  imports: [PassportModule, PrismaModule, PassportModule.register({session: true})],
  providers: [ActivitylogService, UserService, Api42Service, AuthService, OauthStrategy, TotpStrategy, SessionSerializer, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
