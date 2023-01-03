import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { mokeUserId } from './constants';

describe('UsersController', () => {
  let controller: UserController;

  const mockUserService = {
    findByEmail: jest.fn((email: string) => {
      return {
        bio: 'testbio',
        email,
        image: 'test.jpg',
        accessToken: 'exampleoftesttoken',
        username: 'testusername',
      };
    }),
    create: jest.fn((dto: CreateUserDto) => {
      return {
        bio: 'testbio',
        email: dto.email,
        image: 'test.jpg',
        accessToken: 'exampleoftesttoken',
        username: dto.username,
      };
    }),
    update: jest.fn((id, dto: UpdateUserDto) => {
      return {
        bio: dto.bio,
        email: dto.email,
        image: dto.image,
        accessToken: 'exampleoftesttoken',
        username: dto.username,
      };
    }),
    delete: jest.fn((email: string) => {
      return 1;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overridePipe(ValidationPipe)
      .useClass(new ValidationPipe())
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return user by email', async () => {
    const email = 'test@test.com';
    expect(await controller.findMe(email)).toEqual({
      bio: 'testbio',
      email,
      image: 'test.jpg',
      accessToken: 'exampleoftesttoken',
      username: 'testusername',
    });
  });
  it('should create user and return him', async () => {
    const email: string = 'test@test.com';
    expect(
      await controller.create({
        email,
        username: 'test',
        password: 'test',
      }),
    ).toEqual({
      bio: 'testbio',
      email,
      image: 'test.jpg',
      accessToken: 'exampleoftesttoken',
      username: 'test',
    });
  });
  it('should update user and return him', async () => {
    const email = 'testupdated@test.com';
    expect(
      await controller.update(mokeUserId, {
        email,
        image: 'testupdated.jpg',
        username: 'testupdated',
        bio: 'testupdated',
      }),
    ).toEqual({
      bio: 'testupdated',
      email,
      image: 'testupdated.jpg',
      accessToken: 'exampleoftesttoken',
      username: 'testupdated',
    });
  });
  it('should delete user', async () => {
    const email = 'test@test.com';
    expect(await controller.delete(email)).toBe(1);
  });
});
