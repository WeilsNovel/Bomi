/**
 * 健康检查服务 - references/01 §2.7 modules
 * Stage 1 用于验证全局响应拦截器与异常过滤器链路
 */
import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
  uptime: number;
  timestamp: number;
}

@Injectable()
export class HealthService {
  check(): HealthStatus {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }
}
