import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  readonly bio: string;
  
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly image: string;

  @IsNotEmpty()
  readonly username: string;
}
