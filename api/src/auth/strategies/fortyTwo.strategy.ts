import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy, Profile } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  private readonly logger = new Logger(FortyTwoStrategy.name);
  static logger: any;
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
      profileFields: {
        username: 'login',
        avatar: 'image',
      },
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    this.logger.debug(`42 Strategy user: ${profile.username}`);

    const user = {
      id42: profile.username,
      username: profile.username,
      avatar: profile.avatar.versions.small,
    };

    return this.authService.findOrCreateSchool(user);
  }
}
