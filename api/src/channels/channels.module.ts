import { forwardRef, Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { ChannelsController } from './channels.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsGateway, ChannelsService, UsersService],
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MessageModule),
    AuthModule,
  ],
  exports: [ChannelsService],
})
export class ChannelsModule {}
