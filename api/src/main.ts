import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketAdapter } from './socketAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(process.env.API_PORT);
}
bootstrap();
