import { IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  player_oneId: string;
}
