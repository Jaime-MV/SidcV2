import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({ origin: '*' });
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 SIDC API corriendo en http://localhost:3000');
}
bootstrap();
