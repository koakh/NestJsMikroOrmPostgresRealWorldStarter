import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsArray()
  readonly roles?: Role[];
}
