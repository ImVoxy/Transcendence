import {
  WebSocketGateway,
  // SubscribeMessage,
  // MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  // ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { GamesService } from './games.service';
// import { CreateGameDto } from './dto/create-game.dto';
import { SocketWithAuth } from 'src/types';
import { WsCatchAllFilter } from '../exceptions/ws-catch-all-filter';
import { CreateGameDto } from 'src/games/dto/create-game.dto';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: 'games',
  // cors: { origin: process.env.API_PORT, credentials: true },
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GamesGateway.name);
  constructor(private readonly gamesService: GamesService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    // void this.gamesService;
    this.logger.log('Games WebSocket Gateway initialized');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    // const adapter = this.io.adapter;

    this.logger.log(`WS client with id42: ${client.id42} connected`);

    this.logger.debug(
      `Number of connected clients after connection: ${sockets.size}`,
    );
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(
      `Number of connected clients after disconnection: ${sockets.size}`,
    );
  }

  @SubscribeMessage('createGame')
  async createGame(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() createGameDto: CreateGameDto,
  ) {
    void client;
    void createGameDto;
    this.logger.log('create Game from ${client.id42}');
  }
}
