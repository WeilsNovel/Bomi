/**
 * bomi 服务端入口 - references/01 §2.7
 * 启动动作：全局前缀 + ValidationPipe + CORS + 端口监听
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SERVER_CONFIG } from './config/constants';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // 全局 API 前缀（与 shared AI_API_PATH 对齐：/api/ai/...）
  app.setGlobalPrefix(SERVER_CONFIG.API_PREFIX);

  // 全局参数校验管道（class-validator + class-transformer）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.server.port') ?? SERVER_CONFIG.DEFAULT_PORT;
  const corsOrigin = configService.get<string>('app.server.corsOrigin') ?? SERVER_CONFIG.DEFAULT_CORS_ORIGIN;

  app.enableCors({ origin: corsOrigin, credentials: true });

  await app.listen(port);
  Logger.log(
    `bomi server running on http://localhost:${port}/${SERVER_CONFIG.API_PREFIX}`,
    'Bootstrap',
  );
}

bootstrap().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('[bomi] bootstrap failed:', err);
  process.exit(1);
});
