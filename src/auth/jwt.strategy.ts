import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'changeme',
    });
  }

  validate(payload: { sub: number; username: string; role: string }) {
    // This gets attached as req.user
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}