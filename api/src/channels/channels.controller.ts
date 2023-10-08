import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @Request() req: any) {
    const myId = req.user.id;
    return this.channelsService.create(createChannelDto, myId);
  }

  @Get()
  getAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/add_member')
  addMember(@Param('id') id: string, @Body() param: { memberId: string }) {
    return this.channelsService.addMember(id, param.memberId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id/get_members')
  getMembers(@Param('id') id: string) {
    return this.channelsService.findMembers(id);
  }

   // @UseGuards(JwtAuthGuard)
   @Get(':id/get_messages')
   getMessages(@Param('id') id: string) {
     return this.channelsService.findMessages(id);
   }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_member')
  removeMember(@Param('id') id: string, @Body() param: { memberId: string }) {
    return this.channelsService.deleteMember(id, param.memberId);
  }

  // @UseGuards(JwtAuthGuard)
  @Post(':id/add_admin')
  addAdmin(@Param('id') id: string, @Body() param: { adminId: string }) {
    return this.channelsService.addAdmin(id, param.adminId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id/get_admins')
  getAdmins(@Param('id') id: string) {
    return this.channelsService.findAdmins(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_admin')
  removeAdmin(@Param('id') id: string, @Body() param: { adminId: string }) {
    return this.channelsService.deleteAdmin(id, param.adminId);
  }

  // @UseGuards(JwtAuthGuard)
  @Post(':id/add_banned')
  addBanned(@Param('id') id: string, @Body() param: { bannedId: string }) {
    return this.channelsService.addBanned(id, param.bannedId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id/get_banneds')
  getBanneds(@Param('id') id: string) {
    return this.channelsService.findBanneds(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_banned')
  removeBanned(@Param('id') id: string, @Body() param: { bannedId: string }) {
    return this.channelsService.deleteBanned(id, param.bannedId);
  }

  // @UseGuards(JwtAuthGuard)
  @Post(':id/add_muted')
  addMuted(@Param('id') id: string, @Body() param: { mutedId: string }) {
    return this.channelsService.addMuted(id, param.mutedId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id/get_muteds')
  getMuteds(@Param('id') id: string) {
    return this.channelsService.findMuteds(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id/remove_muted')
  removeMuted(@Param('id') id: string, @Body() param: { mutedId: string }) {
    return this.channelsService.deleteMuted(id, param.mutedId);
  }
}
