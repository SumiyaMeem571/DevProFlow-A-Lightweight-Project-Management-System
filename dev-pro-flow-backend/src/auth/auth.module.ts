import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    UserService,
    JwtStrategy,
  ],
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
