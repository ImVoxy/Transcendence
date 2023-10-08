import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { SocketWithAuth } from './types';
import { Server } from 'socket.io';
import * as cookie from 'cookie';

export class SocketAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketAdapter.name);
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [process.env.API_PORT],
        withCredentials: true,
      },
    });

    const createTokenMiddleware =
      (jwtService: JwtService, logger: Logger) =>
      (socket: SocketWithAuth, next) => {
        const token = socket.request.headers.cookie
          ? cookie.parse(socket.request.headers.cookie as string).accessToken
          : // for Postman testing move to token header
            (socket.handshake.headers['token'] as string);

        try {
          const payload = jwtService.verify(token);
          socket.id = payload.id;
          socket.id42 = payload.id42;
          socket.tFA_enabled = payload.tFA_enabled;
          logger.debug(`Token Middleware decoded for user id: ${payload.id}`);
          next();
        } catch {
          next(new Error('Unauthorized'));
        }
      };

    server
      .of('/channels')
      .use(createTokenMiddleware(this.app.get(JwtService), this.logger));

    server
      .of('/games')
      .use(createTokenMiddleware(this.app.get(JwtService), this.logger));

    server
      .of('/users')
      .use(createTokenMiddleware(this.app.get(JwtService), this.logger));

    return server;
  }
}
