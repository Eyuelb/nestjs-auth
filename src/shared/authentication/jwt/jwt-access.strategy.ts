import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConfigHelper } from 'src/shared/constants/constants';
import { ITokenPayload } from './model/jwt.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
      ignoreExpiration: true,
      secretOrKey: JwtConfigHelper.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: ITokenPayload) {
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
  }
}
