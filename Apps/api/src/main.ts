import * as path from 'path';
import * as dotenv from 'dotenv';

// Busca el .env tanto si se ejecuta desde raíz del monorepo como desde Apps/api
const envPaths = [
  path.resolve(process.cwd(), 'Apps/api/.env'),  // desde raíz del monorepo
  path.resolve(process.cwd(), '.env'),            // desde Apps/api directamente
];
for (const p of envPaths) {
  const result = dotenv.config({ path: p });
  if (!result.error) break;
}


import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global: todas las rutas empiezan con /api
  app.setGlobalPrefix('api');

  // Validación estricta de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Filtro global de excepciones con formato consistente
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS habilitado para el frontend
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 SIDC API corriendo en http://localhost:${port}/api`);
}
bootstrap();
