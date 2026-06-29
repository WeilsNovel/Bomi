/**
 * JWT 鉴权守卫 - references/01 §2.7 core/guards
 * 用法：@UseGuards(JwtAuthGuard) 装饰 controller/method
 *
 * 依赖 JwtStrategy（需在 auth 模块 providers 注册，Stage 2 落地）
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_CONFIG } from '../../config/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_CONFIG.STRATEGY_NAME) {}
