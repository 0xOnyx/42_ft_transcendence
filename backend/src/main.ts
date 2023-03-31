import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import sessionsMiddleware from './sessions'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(sessionsMiddleware)
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(3000);

}
bootstrap();
