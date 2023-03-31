import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EventWsModule } from './eventWs/eventWsModule';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, EventWsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
