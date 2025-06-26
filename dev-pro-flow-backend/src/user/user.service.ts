import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRep: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByusername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }
    const user = this.userRep.create(createUserDto);
    const savedUser = await this.userRep.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return result;
  }

  async getUserForTask(roles: string[]) {
    try {
      const users = await this.userRep.find({
        where: { role: In(roles) },
        select: ['id', 'username'],
      });
      return users;
    } catch (error) {
      console.error('Error in getUserForTask:', error);
      throw error;
    }
  }

  async findAll() {
    const users = await this.userRep.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: number) {
    const user = await this.userRep.findOne({ where: { id } });
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async findByusername(username: string) {
    return await this.userRep.findOne({ where: { username: username } });
  }
}
