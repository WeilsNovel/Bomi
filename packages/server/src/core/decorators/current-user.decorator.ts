/**
 * 当前用户装饰器 - references/01 §2.7 core/decorators
 * 用法：
 *   @CurrentUser() user: JwtPayload            // 取整个 payload
 *   @CurrentUser('userId') userId: number      // 取单个字段
 *
 * 需配合 @UseGuards(JwtAuthGuard) 使用（JwtAuthGuard 注入 request.user）
 */
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '@bomi/shared';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | unknown => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
