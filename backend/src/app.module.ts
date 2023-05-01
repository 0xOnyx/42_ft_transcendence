import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EventWsModule } from './eventWs/eventWsModule';
import { MessageModule } from './message/message.module';
import {ConfigModule} from "@nestjs/config";
import { GameModule } from './game/game.module';
import { GameWsModule } from './gameWs/gamews.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(), 
    AuthModule, 
    PrismaModule,
    UserModule, 
    EventWsModule,
    MessageModule, 
    GameModule,
    GameWsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
