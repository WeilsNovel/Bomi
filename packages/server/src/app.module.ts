/**
 * bomi 服务端根模块 - references/01 §2.7
 * 注册：ConfigModule + 全局中间件 + 全局响应拦截器 + 全局异常过滤器 + 业务模块
 */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { appConfigLoader } from './config/env';
import { ENV_FILE_PATHS } from './config/constants';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { TraceIdMiddleware } from './common/middleware/trace-id.middleware';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [...ENV_FILE_PATHS],
      load: [appConfigLoader],
    }),
    HealthModule,
  ],
  providers: [
    /** 全局响应拦截器：统一输出 BaseApiResponse<T> */
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    /** 全局异常过滤器：异常 → ERROR_CODE → BaseApiResponse */
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  /** 全局中间件：TraceId 在最早阶段注入，保证异常路径也能输出 traceId */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceIdMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
