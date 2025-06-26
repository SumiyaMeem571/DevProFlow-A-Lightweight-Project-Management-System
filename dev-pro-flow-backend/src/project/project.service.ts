import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      created_by: user,
    });
    return this.projectRepository.save(project);
  }

  async findAll() {
    return this.projectRepository.find({
      relations: ['created_by'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['created_by'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: number, dto: UpdateProjectDto, user: User) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['created_by'],
    });
    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    if (project.created_by.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this project');
    }

    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async remove(id: number, user: User) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['created_by'],
    });
    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    if (project.created_by.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this project',
      );
    }

    await this.projectRepository.remove(project);
    return { message: `Project ${project.name} deleted successfully` };
  }
}
