/**
 * 健康检查控制器 - references/01 §2.7 modules
 * 路径：GET /api/health（全局前缀 api + 本 controller 'health'）
 */
import { Controller, Get } from '@nestjs/common';
import { HealthService, type HealthStatus } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthStatus {
    return this.healthService.check();
  }
}
