import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/auth/Guard/jwt-auth.guard';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminGuard } from './guard/admin.guard';

@Controller('admin')
@UseGuards(JwtGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('all-users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('get-user/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(+id);
  }

  @Patch('update-user/:id')
  updateUser(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateUser(+id, updateAdminDto);
  }

  @Patch('update-status/:id/toggle-active')
  toggleUserActiveStatus(@Param('id') id: string) {
    return this.adminService.toggleUserActiveStatus(+id);
  }

  @Delete('remove-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }
}
