import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async changeStatusOnline(id: string): Promise<any> {
    return await this.prisma.user.update({
      where: { id },
      data: { status: Status.ONLINE },
    });
  }

  async changeStatusOffline(id: string): Promise<any> {
    return await this.prisma.user.update({
      where: { id },
      data: { status: Status.OFFLINE },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findOrCreateSchool(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id42: createUserDto.id42 },
    });
    if (!user) {
      return this.create(createUserDto);
    } else {
      return user;
    }
  }

  async findAll(): Promise<any> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<any> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findById42(id42: string): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { id42 },
    });
  }

  async addFriendRequest(id: string, myId: string) {
    await this.prisma.user.update({
      where: { id: myId },
      data: {
        friend_requests_sent: {
          connect: { id },
        },
      },
    });
    return await this.prisma.user.update({
      where: { id },
      data: {
        friend_requests_received: {
          connect: { id: myId },
        },
      },
      include: {
        friend_requests_received: true,
      },
    });
  }

  async findFriendRequestsReceived(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { friend_requests_received: true },
    });
  }

  async findFriendRequestsSent(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { friend_requests_sent: true },
    });
  }

  async deleteFriendRequest(id: string, myId: string) {
    await this.prisma.user.update({
      where: { id: myId },
      data: {
        friend_requests_sent: {
          disconnect: { id },
        },
      },
    });
    return await this.prisma.user.update({
      where: { id },
      data: {
        friend_requests_received: {
          disconnect: { id: myId },
        },
      },
      include: {
        friend_requests_received: true,
      },
    });
  }

  async addFriend(id: string, myId: string) {
    const check_friend_request =
      (await this.prisma.user.findFirst({
        where: {
          id: myId,
          friend_requests_received: {
            some: { id: id },
          },
        },
      })) ||
      (await this.prisma.user.findFirst({
        where: {
          id: id,
          friend_requests_received: {
            some: { id: myId },
          },
        },
      }));
    if (!check_friend_request) {
      return console.error('User', id, "didn't send you friend request");
    }
    await this.prisma.user.update({
      where: { id: myId },
      data: {
        friends: {
          connect: { id },
        },
      },
      include: {
        friends: true,
      },
    });
    return await this.prisma.user.update({
      where: { id },
      data: {
        friends: {
          connect: { id: myId },
        },
      },
      include: {
        friends: true,
      },
    });
  }

  async findFriends(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { friends: true },
    });
  }

  async deleteFriend(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        friends: {
          disconnect: { id: myId },
        },
      },
      include: {
        friends: true,
      },
    });
  }

  async addBlocked(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        blocked: {
          connect: { id },
        },
      },
      include: {
        blocked: true,
      },
    });
  }

  async findBlocked(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { blocked: true },
    });
  }

  async deleteBlocked(id: string, myId: string) {
    await this.prisma.user.update({
      where: { id: myId },
      data: {
        blocked: {
          disconnect: { id },
        },
      },
    });
    return await this.prisma.user.update({
      where: { id },
      data: {
        blocked: {
          disconnect: { id: myId },
        },
      },
      include: {
        blocked: true,
      },
    });
  }

  async addOwnChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        own_channels: {
          connect: { id },
        },
      },
      include: {
        own_channels: true,
      },
    });
  }

  async findOwnChannels(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { own_channels: true },
    });
  }

  async deleteOwnChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        own_channels: {
          disconnect: { id },
        },
      },
      include: {
        own_channels: true,
      },
    });
  }

  async addMemberChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        member_channels: {
          connect: { id },
        },
      },
      include: {
        member_channels: true,
      },
    });
  }

  async findMemberChannels(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { member_channels: true },
    });
  }

  async deleteMemberChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        member_channels: {
          disconnect: { id },
        },
      },
      include: {
        member_channels: true,
      },
    });
  }

  async addAdminChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        admin_channels: {
          connect: { id },
        },
      },
      include: {
        admin_channels: true,
      },
    });
  }

  async findAdminChannels(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { admin_channels: true },
    });
  }

  async deleteAdminChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        admin_channels: {
          disconnect: { id },
        },
      },
      include: {
        admin_channels: true,
      },
    });
  }

  async addBannedChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        banned_channels: {
          connect: { id },
        },
      },
      include: {
        banned_channels: true,
      },
    });
  }

  async findBannedChannels(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { banned_channels: true },
    });
  }

  async deleteBannedChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        banned_channels: {
          disconnect: { id },
        },
      },
      include: {
        banned_channels: true,
      },
    });
  }

  async addMutedChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        muted_channels: {
          connect: { id },
        },
      },
      include: {
        muted_channels: true,
      },
    });
  }

  async findMutedChannels(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { muted_channels: true },
    });
  }

  async deleteMutedChannel(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        muted_channels: {
          disconnect: { id },
        },
      },
      include: {
        muted_channels: true,
      },
    });
  }

  async addChatInvite(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        chat_invites: {
          connect: { id },
        },
      },
      include: {
        chat_invites: true,
      },
    });
  }

  async findChatInvites(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { chat_invites: true },
    });
  }

  async deleteChatInvite(id: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        chat_invites: {
          disconnect: { id },
        },
      },
      include: {
        chat_invites: true,
      },
    });
  }

  async set2FASecret(secret: string, myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        tFA_secret: secret,
      },
    });
  }

  async set2FAEnabled(myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        tFA_enabled: true,
      },
    });
  }

  async set2FADisabled(myId: string) {
    return await this.prisma.user.update({
      where: { id: myId },
      data: {
        tFA_enabled: false,
      },
    });
  }
}
