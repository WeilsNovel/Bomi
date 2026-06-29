/**
 * JWT 策略 - references/01 §2.7 core/guards
 * passport-jwt 策略：从 Authorization: Bearer <token> 解析 JwtPayload
 *
 * 注：本策略需在 Stage 2 auth 模块的 providers 中注册后，JwtAuthGuard 才可生效。
 * Stage 1 仅提供框架代码。
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERROR_CODE, type JwtPayload } from '@bomi/shared';
import { APP_CONFIG_NAMESPACE } from '../../config/env';
import { JWT_CONFIG } from '../../config/constants';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_CONFIG.STRATEGY_NAME) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>(`${APP_CONFIG_NAMESPACE}.jwt.secret`);
    if (!secret) {
      throw new Error('[bomi] JWT secret not configured (check process.env.JWT_SECRET)');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /** passport 校验通过后调用，返回值注入到 request.user */
  validate(payload: JwtPayload): JwtPayload {
    if (!payload || typeof payload.userId !== 'number') {
      throw new BusinessException({ code: ERROR_CODE.UNAUTHORIZED });
    }
    return payload;
  }
}
