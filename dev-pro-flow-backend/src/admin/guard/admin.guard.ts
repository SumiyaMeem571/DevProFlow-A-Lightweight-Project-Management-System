// src/auth/guards/admin.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }
}
