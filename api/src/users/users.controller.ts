import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
// import { FortyTwoAuthGuard } from '../auth/guards/school.guards';
// import { AuthenticatedGuard }from '../auth/guards/auth.guards'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

//   @UseGuards(AuthenticatedGuard)
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('id42/:id42')
  getById42(@Param('id42') id42: string) {
    return this.usersService.findById42(id42);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_friend_request')
  addFriendRequest(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addFriendRequest(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_friend_requests_received')
  getFriendRequestsReceived(@Param('id') id: string) {
    return this.usersService.findFriendRequestsReceived(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_friend_requests_sent')
  getFriendRequestsSent(@Param('id') id: string) {
    return this.usersService.findFriendRequestsSent(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_friend_request')
  removeFriendRequest(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteFriendRequest(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_friend')
  addFriend(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addFriend(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_friends')
  getFriends(@Param('id') id: string) {
    return this.usersService.findFriends(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_friend')
  removeFriend(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteFriend(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_blocked')
  addBlocked(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addBlocked(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_blocked')
  getBlocked(@Param('id') id: string) {
    return this.usersService.findBlocked(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_blocked')
  removeBlocked(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteBlocked(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_own_channel')
  addOwnChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addOwnChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_own_channels')
  getOwnChannels(@Param('id') id: string) {
    return this.usersService.findOwnChannels(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_own_channel')
  removeOwnChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteOwnChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_member_channel')
  addMemberChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addMemberChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_member_channels')
  getMemberChannels(@Param('id') id: string) {
    return this.usersService.findMemberChannels(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_member_channel')
  removeMemberChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteMemberChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_admin_channel')
  addAdminChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addAdminChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_admin_channels')
  getAdminChannels(@Param('id') id: string) {
    return this.usersService.findAdminChannels(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_admin_channel')
  removeAdminChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteAdminChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_banned_channel')
  addBannedChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addBannedChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_banned_channels')
  getBannedChannels(@Param('id') id: string) {
    return this.usersService.findBannedChannels(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_admin_channel')
  removeBannedChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteBannedChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_muted_channel')
  addMutedChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addMutedChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_muted_channels')
  getMutedChannels(@Param('id') id: string) {
    return this.usersService.findMutedChannels(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_muted_channel')
  removeMutedChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteMutedChannel(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_chat_invite')
  addChatInvite(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.addChatInvite(id, myId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/get_chat_invites')
  getChatInvites(@Param('id') id: string) {
    return this.usersService.findChatInvites(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_chat_invite')
  removeChatInviteChannel(@Param('id') id: string, @Request() req: any) {
    const myId = req.user.id;
    return this.usersService.deleteChatInvite(id, myId);
  }
// @Get(':id/profile'
// getProfile(@Param('id') id: string) {
//   return this.usersService.findProfile(id);
// }

// @Get(':id/get_chat_invites')
// getChatInvites(@Param('id') id: string) {
//   return this.usersService.findChatInvites(id);
// }

// @Post(':username/check_password')
// checkPassword(
//   @Param('username') username: string,
//   @Body() password: { password: string },
// ) {
//   return this.usersService.verifyPassword(password.password, username);
// }
}
