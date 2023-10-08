import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  tFA_secret?: string;

  @IsBoolean()
  @IsOptional()
  tFA_enabled?: boolean = false;

  @IsString()
  @IsOptional()
  password?: string;
}
