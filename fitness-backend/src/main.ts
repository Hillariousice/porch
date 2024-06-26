import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3005);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Database is running on: ${process.env.DB_NAME}`);
}
bootstrap();
