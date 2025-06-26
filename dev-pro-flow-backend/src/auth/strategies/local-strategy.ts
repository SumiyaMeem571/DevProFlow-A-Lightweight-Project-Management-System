import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      console.log('User not found or password invalid:', username);
      throw new UnauthorizedException({
        message: 'User not found or password invalid',
      });
    }
    return user;
  }
}
