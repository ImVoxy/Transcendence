import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SocketWithAuth } from 'src/types';
import { WsCatchAllFilter } from '../exceptions/ws-catch-all-filter';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: '/users',
  cors: { origin: [`${process.env.URL_FRONT}`], credentials: true },
})
export class UsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(UsersGateway.name);
  constructor(private readonly usersService: UsersService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Users WebSocket Gateway initialized');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    // this.logger.debug(`Socket connected with id42: ${client.id42}`);

    this.io.emit('online', `WS Client with id: ${client.id} is online`);
    this.usersService.changeStatusOnline(client.id);

    this.logger.log(`WS client with id42: ${client.id42} connected`);
    this.logger.debug(
      `Number of connected clients after connection: ${sockets.size}`,
    );
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.usersService.changeStatusOffline(client.id);

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(
      `Number of connected clients after disconnection: ${sockets.size}`,
    );
  }

  @SubscribeMessage('createUser')
  create(@MessageBody() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SubscribeMessage('findAllUsers')
  findAll() {
    this.logger.log('findAllUsers');
    return this.usersService.findAll();
  }

  @SubscribeMessage('findOneUser')
  findOne(@MessageBody() id: string) {
    return this.usersService.findOne(id);
  }

  //   @SubscribeMessage('updateUser')
  //   update(@MessageBody() updateUserDto: UpdateUserDto) {
  //     return this.usersService.update(updateUserDto.id, updateUserDto);
  //   }

  @SubscribeMessage('removeUser')
  remove(@MessageBody() id: string) {
    return this.usersService.remove(id);
  }

  @SubscribeMessage('test')
  test() {
    this.logger.log('test');
    // throw new BadRequestException({ merde: 'Merde!' });
  }
}
