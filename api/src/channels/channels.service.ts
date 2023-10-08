import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { channelsConstants } from './channels.constants';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(createChannelDto: CreateChannelDto, myId: string) {
    if (createChannelDto.password) {
      createChannelDto.password = await bcrypt.hash(
        createChannelDto.password,
        10,
      );
    }
    if (
      await this.prisma.channel.findFirst({
        where: { name: createChannelDto.name },
      })
    ) {
      throw new BadRequestException('Channel name already exists');
    }
    const thisChannel = await this.prisma.channel.create({
      data: createChannelDto,
    });
    await this.prisma.user.update({
      where: { id: myId },
      data: {
        own_channels: {
          connect: { id: thisChannel.id },
        },
        admin_channels: {
          connect: { id: thisChannel.id },
        },
      },
    });
    return await this.prisma.channel.findUnique({
      where: { id: thisChannel.id },
      include: {
        owner: true,
        admins: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.channel.findMany();
  }

  async findByName(name: string) {
    return await this.prisma.channel.findMany({
      where: { name },
    });
  }

  async findAllwithUser(myId: string) {
    return await this.prisma.channel.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                id: myId,
              },
            },
          },
          {
            admins: {
              some: {
                id: myId,
              },
            },
          },
        ],
      },
    });
  }

  // async findByMembers(id: string, myId: string) {
  //   return await this.prisma.channel.findFirst({
  //     include: {
  //       members: true,
  //     },
  //     where: {
  //       members: {
  //         some: {
  //           id: id,
  //           AND: {
  //             id: myId,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  async findOne(id: string) {
    return await this.prisma.channel.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    return await this.prisma.channel.update({
      where: { id },
      data: updateChannelDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.channel.delete({
      where: { id },
    });
  }

  async addMember(userId: string, memberId: string) {
    return await this.prisma.channel.update({
      where: { id: userId },
      data: {
        members: {
          connect: {
            id: memberId
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async findMembers(id: string) {
    return this.prisma.channel.findMany({
      where: { id },
      include: { members: true },
    });
  }

  async deleteMember(id: string, memberId: string) {
    return await this.prisma.channel.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: memberId },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async addAdmin(id: string, adminId: string) {
    return await this.prisma.channel.update({
      where: { id },
      data: {
        admins: {
          connect: { id: adminId },
        },
      },
      include: {
        admins: true,
      },
    });
  }

  async findAdmins(id: string) {
    return this.prisma.channel.findMany({
      where: { id },
      include: { admins: true },
    });
  }

  async deleteAdmin(id: string, adminId: string) {
    const thisChannel = await this.findOne(id);
    if (thisChannel && thisChannel.ownerId != adminId) {
      return await this.prisma.channel.update({
        where: { id },
        data: {
          admins: {
            disconnect: { id: adminId },
          },
        },
        include: {
          admins: true,
        },
      });
    } else {
      return console.error('Owner should be Admin');
    }
  }

  async addBanned(id: string, bannedId: string) {
    this.deleteBannedAfterTimout(id, bannedId);
    return await this.prisma.channel.update({
      where: { id },
      data: {
        banned: {
          connect: { id: bannedId },
        },
      },
      include: {
        banned: true,
      },
    });
  }

  deleteBannedAfterTimout(id: string, bannedId: string) {
    setTimeout(() => {
      this.deleteBanned(id, bannedId);
    }, channelsConstants.timeOut);
  }

  async findBanneds(id: string) {
    return this.prisma.channel.findMany({
      where: { id },
      include: { banned: true },
    });
  }

  async deleteBanned(id: string, bannedId: string) {
    return await this.prisma.channel.update({
      where: { id },
      data: {
        banned: {
          disconnect: { id: bannedId },
        },
      },
      include: {
        banned: true,
      },
    });
  }

  async addMuted(id: string, mutedId: string) {
    this.deleteMutedAfterTimout(id, mutedId);
    return await this.prisma.channel.update({
      where: { id },
      data: {
        muted: {
          connect: { id: mutedId },
        },
      },
      include: {
        muted: true,
      },
    });
  }

  deleteMutedAfterTimout(id: string, mutedId: string) {
    setTimeout(() => {
      this.deleteMuted(id, mutedId);
    }, channelsConstants.timeOut);
  }

  async findMuteds(id: string) {
    return this.prisma.channel.findMany({
      where: { id },
      include: { muted: true },
    });
  }

  async deleteMuted(id: string, mutedId: string) {
    return await this.prisma.channel.update({
      where: { id },
      data: {
        muted: {
          disconnect: { id: mutedId },
        },
      },
      include: {
        muted: true,
      },
    });
  }

  async isOwner(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });
    if (!channel) {
      return false;
    }
    return true;
  }

  async isAdmin(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id,
        admins: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!channel) {
      return false;
    }
    return true;
  }

  async isMember(id: string, userId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!channel) {
      return false;
    }
    return true;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const thisMessage = await this.prisma.message.create({
      data: createMessageDto,
    });
    console.log(thisMessage.id);
    if (!thisMessage) {
      throw new NotFoundException('Message not created');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: createMessageDto.authorId },
      data: {
        messages: {
          connect: { id: thisMessage.id },
        },
      },
    });
    if (!updatedUser) {
      throw new NotFoundException('User not updated');
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { id: createMessageDto.channelId },
      data: {
        messages: {
          connect: { id: thisMessage.id },
        },
      },
    });
    if (!updatedChannel) {
      throw new NotFoundException('Channel not updated');
    }

    const newMessage = await this.prisma.message.findUnique({
      where: { id: thisMessage.id },
      include: {
        author: true,
        channel: true,
      },
    });
    if (!newMessage) {
      throw new NotFoundException('Message not found');
    }
    return newMessage;
  }

  // async findMessages(id: string) {
  //   return await this.prisma.message.findUnique({
  //     where: { id: id },
  //     include: {
  //       messages: true,
  //     },
  //   });
  // }

  async findMessages(id: string) {
    return this.prisma.channel.findMany({
      where: { id },
      include: { messages: true },
    });
  }

  async removeMessage(deleteMessageId: string) {
    return await this.prisma.message.delete({
      where: { id: deleteMessageId },
    });
  }
}
