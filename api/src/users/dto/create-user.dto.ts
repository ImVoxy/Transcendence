import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id42: string;

  @IsString()
  @Length(2, 25)
  username: string;

  @IsString()
  @IsOptional()
  avatar?: string = 'https://';

  @IsString()
  @Length(5, 25)
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  tFA_enabled?: boolean = false;
}
