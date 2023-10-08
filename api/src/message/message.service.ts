import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  async create(id: string, myId: string, createMessageDto: CreateMessageDto) {
    const thisMessage = await this.prisma.message.create({
      data: createMessageDto,
    });

    await this.prisma.user.update({
      where: { id: myId },
      data: {
        messages: {
          connect: { id: thisMessage.id },
        },
      },
    });
    await this.prisma.channel.update({
      where: { id },
      data: {
        messages: {
          connect: { id: thisMessage.id },
        },
      },
    });
    return await this.prisma.message.findUnique({
      where: { id: thisMessage.id },
      include: {
        author: true,
        channel: true,
      },
    });
  }

  async findAll(id: string) {
    return await this.prisma.channel.findUnique({
      where: { id: id },
      include: {
        messages: true,
      },
    });
  }

  async remove(deleteMessageId: string) {
    return await this.prisma.message.delete({
      where: { id: deleteMessageId },
    });
  }
}
