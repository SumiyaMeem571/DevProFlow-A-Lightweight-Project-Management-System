import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
