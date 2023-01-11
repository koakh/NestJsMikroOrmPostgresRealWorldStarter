import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../shared/decorators';
import { CustomHttpException } from '../shared/exceptions';
import { RolesAuthGuard } from '../shared/guards';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './user.decorator';
import { Role } from './user.entity';
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

  @Roles(Role.Admin)
  @UseGuards(RolesAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('user')
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesAuthGuard)
  @Delete('user/:slug')
  async delete(@Param() params): Promise<any> {
    return this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('user/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<IUserRO> {
    const foundUser = await this.userService.findOne(loginUserDto);

    if (!foundUser) {
      throw new CustomHttpException(HttpStatus.UNAUTHORIZED, { errorMessage: 'Unauthorized' });
    }
    const accessToken = await this.userService.generateJWT(foundUser);
    const { email, username, roles } = foundUser;
    const user = { accessToken, email, username, roles };
    return { user };
  }
}
