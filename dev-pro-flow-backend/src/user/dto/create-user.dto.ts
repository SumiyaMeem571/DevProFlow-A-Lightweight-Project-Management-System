import {
  IsNotEmpty,
  Length,
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2)
  @IsString()
  name: string;

  @IsNotEmpty()
  @Length(4)
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phonenumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
