import { IsOptional, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  // @Length(1, 256)
  text: string;

  @IsString()
  @IsOptional()
  authorId: string;

  @IsString()
  @IsOptional()
  channelId: string;
}
