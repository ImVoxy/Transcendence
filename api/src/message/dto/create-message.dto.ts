// import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  // @ApiProperty()
  @IsString()
  text: string;

  // @ApiProperty()
  @IsString()
  @IsOptional()
  authorId: any;

  // @ApiProperty()
  @IsString()
  @IsOptional()
  channelId: any;
}
