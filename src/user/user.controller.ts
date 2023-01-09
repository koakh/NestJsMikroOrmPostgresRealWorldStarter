import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../shared/decorators';
import { Roles as UserRoles } from '../shared/enums';
import { RolesAuthGuard } from '../shared/guards';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './user.decorator';
import { IUserRO } from './user.interface';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('email') email: string): Promise<IUserRO> {
    return this.userService.findByEmail(email);
  }

  @Put('user')
  async update(@User('id') userId: string, @Body() userData: UpdateUserDto) {
    return this.userService.update(userId, userData);
  }

  @Roles(UserRoles.ROLE_ADMIN)
  @UseGuards(RolesAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params): Promise<any> {
    return this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<IUserRO> {
    const foundUser = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!foundUser) {
      throw new HttpException({ errors }, 401);
    }
    const accessToken = await this.userService.generateJWT(foundUser);
    const { email, username, bio, image } = foundUser;
    const user = { email, accessToken, username, bio, image };
    return { user };
  }
}
