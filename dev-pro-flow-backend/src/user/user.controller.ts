import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from 'src/auth/Guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get('getUserforTask')
  getUserForTask() {
    return this.userService.getUserForTask(['MANAGER', 'MEMBER']);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('by-name/:name')
  findByUsername(@Param('name') name: string) {
    return this.userService.findByusername(name);
  }
}
