import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { SocketWithAuth } from 'src/types';
import { WsCatchAllFilter } from '../exceptions/ws-catch-all-filter';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from '../message/message.service';
import { Server, Socket } from 'socket.io';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: '/channels',
  cors: { origin: process.env.API_PORT, credentials: true },
})
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChannelsGateway.name);
  constructor(private readonly channelsService: ChannelsService,
    private readonly meassageService: MessageService,) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Channels WebSocket Gateway initialized');
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    const adapter = this.io.adapter;

    this.logger.log(`WS client with id42: ${client.id42} connected`);

    const channelsWithUser = await this.channelsService.findAllwithUser(
      client.id,
    );
    channelsWithUser.forEach((channel) => {
      client.join(channel.id);
      this.logger.debug(`Client join the room with the name: ${channel.name}`);
    });
    channelsWithUser.forEach((channel) => {
      const connectedClients = adapter.rooms.get(channel.id)?.size ?? '0';
      this.logger.debug(
        `Total client connected to room ${channel.name}: ${connectedClients}`,
      );
    });

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

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: SocketWithAuth,
    message: { sender: string; room: string; message: string },
  ) {
    this.io.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('sentMessage')
  async chatToServer(
    @MessageBody() id: string,
    myId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<void> {
    await this.meassageService.create(id, myId, createMessageDto);
    
    //const thisChannel = await this.channelsService.findOne(+id);
    this.io.to(id).emit('updateMessageList', createMessageDto);
  }


  @SubscribeMessage('createChannel')
  async createChannel(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() createChannelDto: CreateChannelDto,
  ) {
    const newChannel = await this.channelsService.create(
      createChannelDto,
      client.id,
    );
    if (newChannel) {
      client.join(newChannel.id);
      this.io
        .to(newChannel.id)
        .emit(
          'channel',
          `The room with id: ${newChannel.id} for this channel is created`,
        );
      return newChannel;
    }
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('channelId') channelId: string,
  ) {
    this.logger.debug(`Client: ${client.id} join channel: ${channelId}`);
    client.join(channelId);
    client.to(channelId).emit('channel', `Client: ${client.id} joined`);
    return await this.channelsService.addMember(channelId, client.id);
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('channelId') channelId: string,
  ) {
    this.logger.debug(`Client: ${client.id} leave channel: ${channelId}`);
    client.leave(channelId);
    client.to(channelId).emit('channel', `Client: ${client.id} leaved`);
    const connectedRooms: string[] = [...client.rooms].slice(1);
    connectedRooms.forEach((room) => {
      this.logger.debug(`This client still in the room: ${room}`);
    });
    return await this.channelsService.deleteMember(channelId, client.id);
  }

  @SubscribeMessage('createMessage')
  async createMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    this.logger.debug(createMessageDto.text);
    createMessageDto.authorId = client.id;
    this.logger.debug(
      `Client: ${client.id} send message to channel: ${createMessageDto.channelId}`,
    );
    this.logger.debug(
      `Client: ${client.id} send message to channel: ${createMessageDto.channelId}`,
    );
    const thisMessage = await this.channelsService.createMessage(
      createMessageDto,
    );
    if (thisMessage) {
      this.io
        .to(createMessageDto.channelId)
        .emit('message', `${client.id}: ${thisMessage.text}`);
      this.logger.debug(
        `Client: ${client.id} send message with id: ${thisMessage.id} to channel: ${createMessageDto.channelId}`,
      );
    }
    return thisMessage;
  }

// ----------

  //   @SubscribeMessage('findOneUser')
  //   findOne(@MessageBody() id: string) {
  //     return this.usersService.findOne(id);
  //   }

  //   //   @SubscribeMessage('updateUser')
  //   //   update(@MessageBody() updateUserDto: UpdateUserDto) {
  //   //     return this.usersService.update(updateUserDto.id, updateUserDto);
  //   //   }

  //   @SubscribeMessage('removeUser')
  //   remove(@MessageBody() id: string) {
  //     return this.usersService.remove(id);
  //   }

  //   @SubscribeMessage('test')
  //   test() {
  //     this.logger.log('test');
  //     throw new BadRequestException({ merde: 'Merde!' });
  //   }
}
