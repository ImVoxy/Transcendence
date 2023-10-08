import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto, myId: string) {
    // TODO
    void createGameDto;
    void myId;
  }
}
