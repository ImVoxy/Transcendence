import { IsOptional, IsString, Length } from 'class-validator';
import { Access } from '@prisma/client';

export class CreateChannelDto {
  @IsString()
  @Length(2, 25)
  name: string;

  @IsString()
  @IsOptional()
  access: Access;

  @IsString()
  @IsOptional()
  password: string;
}
