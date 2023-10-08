import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  static logger: any;
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Strategy for user: ${payload.id42}`);
    const user = await this.usersService.findOne(payload.id);
    // this.logger.debug('JWT Strategy', user);
    if (!user || user.tFA_enabled !== payload.tFA_enabled) {
      return null;
    }
    return user;
  }

  private static extractJwtFromCookie(req: Request): string | null {
    // this.logger.log('JWT Strategy extract', req.cookies.accessToken);
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      req.cookies.accessToken.length > 0
    ) {
      return req.cookies.accessToken;
    }
    return null;
  }
}
