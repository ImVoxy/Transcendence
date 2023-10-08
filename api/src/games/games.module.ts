import { forwardRef, Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [GamesGateway, GamesService, UsersService],
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  exports: [GamesService],
})
export class GamesModule {}
