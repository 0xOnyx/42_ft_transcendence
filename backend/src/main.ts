import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import sessionsMiddleware from './sessions'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(sessionsMiddleware)
  app.use(passport.initialize())
  app.use(passport.session())



  const config = new DocumentBuilder()
      .setTitle('42_ft_transcendence API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('NestJs')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);

}
bootstrap();
