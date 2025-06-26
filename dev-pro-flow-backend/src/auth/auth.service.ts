import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByusername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      //return without the pass property
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      message: 'Login successful',
      id: user.id,
      username: user.username,
      role: user.role,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
