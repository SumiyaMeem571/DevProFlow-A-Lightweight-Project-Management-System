import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './Guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('inside login');
    return await this.authService.login(req.user);
  }
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
