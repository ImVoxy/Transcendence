import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersGateway } from './users.gateway';
import { ChannelsService } from '../channels/channels.service';
import { ChannelsModule } from '../channels/channels.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersGateway, UsersService, ChannelsService],
  imports: [
    PrismaModule,
    forwardRef(() => ChannelsModule),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
