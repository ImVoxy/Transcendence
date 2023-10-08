import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
// import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@Controller('message')
// @ApiTags('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
  ) {
    const myId = req.user.id;
    return this.messageService.create(id, myId, createMessageDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.messageService.findAll(id);
  }

  @Delete(':deleteMessageId')
  remove(@Param('deleteMessageId') deleteMessageId: string) {
    return this.messageService.remove(deleteMessageId);
  }
}
