import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from './common/enums/environment.enum';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const service = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.setGlobalPrefix(service.getOrThrow(EnvironmentVariable.CONTEXT_PATH));
  await app.listen(4000);
}
bootstrap();
