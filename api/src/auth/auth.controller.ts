import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Req,
  Res,
  Logger,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/fortyTwo.guards';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guards';
// import { LocalAuthGuard } from './guards/local.guards';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RequestWithUser } from '../types';
import { UsersService } from '../users/users.service';
// import { Access } from '@prisma/client';

@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const attempt = createUserDto.password as string;
    const user = await this.authService.findOrCreateSchool(createUserDto);
    this.logger.debug(`Login attempt for user: ${user.id42}`);
    if (!user || !(await this.authService.validateUser(user.id42, attempt))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = this.authService.getCookieWithJwtAccessToken(
      user,
      user.tFA_enabled,
    );
    this.logger.debug(`Created accessToken for user: ${user.id42}`);
    // response.header('Access-Control-Allow-Origin', '*');

    response
      .cookie('accessToken', payload.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30),
      })
      .send(user);
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('/redirect')
  async createToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findById42(req.user.id42);
    const payload = this.authService.getCookieWithJwtAccessToken(
      user,
      user.tFA_enabled,
    );
    this.logger.debug(`Created accessToken for user: ${req.user.id42}`);
    response.cookie('accessToken', payload.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 30),
    });

    req.user.tFA_enabled
      ? response.redirect('http://localhost:3000/tfa')
      : response.redirect('http://localhost:3000/menu');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getProfile(@Req() req: RequestWithUser) {
    return await this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.authService.changeUserStatusOffline(request.user.id);
    response.clearCookie('accessToken');
    this.logger.debug(`Delete cookie for user: ${request.user.id42}`);
    return {
      message: 'Logout success',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/generate2fa')
  async generate2FA(
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ) {
    const otpauthUrl = await this.authService.generate2FA(request.user);
    return this.authService.sendQrCode(response, otpauthUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify2fa')
  @HttpCode(200)
  async auth2FA(
    @Req() request: RequestWithUser,
    @Body()
    { code }: { code: string },
    @Res() response: Response,
  ) {
    const isCodeValid = this.authService.is2FACodeValid(code, request.user);
    if (!isCodeValid) {
      throw new Error('Wrong authentication code');
    }
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user,
      true,
    );
    response
      .cookie('accessToken', accessTokenCookie.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30),
      })
      .send({
        message: '2FA authentication successful',
      });
    this.logger.debug(`2FA authenticate for user: ${request.user.id42}`);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/enable2fa')
  @HttpCode(200)
  async enable2FA(
    @Req() request: RequestWithUser,
    @Body()
    { code }: { code: string },
    @Res() response: Response,
  ) {
    if (request.user.tFA_enabled) {
      throw new Error('2FA already enabled');
    }

    const isCodeValid = this.authService.is2FACodeValid(code, request.user);
    if (!isCodeValid) {
      throw new Error('Wrong authentication code');
    }

    await this.userService.set2FAEnabled(request.user.id);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user,
      true,
    );
    response
      .cookie('accessToken', accessTokenCookie.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30),
      })
      .send({
        message: '2FA successfully enabled',
      });
    this.logger.debug(`2FA enabled for user: ${request.user.id42}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/disable2fa')
  async disable2FA(@Req() request: RequestWithUser, @Res() response: Response) {
    if (!request.user.tFA_enabled) {
      throw new Error('2FA already disabled');
    }
    await this.userService.set2FADisabled(request.user.id);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user,
      false,
    );
    response
      .cookie('accessToken', accessTokenCookie.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30),
      })
      .send({
        message: '2FA successfully disabled',
      });
    this.logger.debug(`2FA disabled for user: ${request.user.id42}`);
  }
}
