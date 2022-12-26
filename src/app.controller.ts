import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('/ping')
  root(): { message: string } {
    return { message: 'pong!' };
  }

}
