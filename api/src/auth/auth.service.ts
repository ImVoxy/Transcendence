import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(id42: string, password: string): Promise<User | null> {
    const user = await this.userService.findById42(id42);
    if (user && (await this.validatePassword(password, user))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validatePassword(attempt: string, user: User): Promise<boolean> {
    if (user.password && attempt) {
      return await bcrypt.compare(attempt, user.password);
    } else {
      return false;
    }
  }

  async findOrCreateSchool(userDto: CreateUserDto) {
    return await this.userService.findOrCreateSchool(userDto);
  }

  getCookieWithJwtAccessToken(user: User, tFA_status: boolean) {
    const payload = { id: user.id, id42: user.id42, tFA_enabled: tFA_status };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async verifyJwt(accessToken: string) {
    return this.jwtService.verifyAsync(accessToken);
  }

  async changeUserStatusOffline(id: string) {
    return await this.userService.changeStatusOffline(id);
  }

  async generate2FA(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.id42,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );
    await this.userService.set2FASecret(secret, user.id);
    return otpauthUrl;
  }

  async sendQrCode(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  is2FACodeValid(code: string, user: User) {
    this.logger.debug(`2FA code: ${code}, ${user.tFA_secret}`);
    return authenticator.verify({
      token: code,
      secret: user.tFA_secret as string,
    });
  }
}
