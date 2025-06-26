import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateAdminDto) {
    const user = await this.getUserById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async toggleUserActiveStatus(id: number) {
    const user = await this.getUserById(id);
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
    return { message: `User with ID ${id} has been deleted.` };
  }
}
