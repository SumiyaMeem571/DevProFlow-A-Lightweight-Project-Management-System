import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto) {
    const project = await this.projectRepo.findOne({
      where: { id: dto.projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const task = this.taskRepo.create({
      ...dto,
      project,
      assignee: dto.assigneeId
        ? await this.userRepo.findOne({ where: { id: dto.assigneeId } })
        : null,
    });

    return this.taskRepo.save(task);
  }

  async findAll() {
    return this.taskRepo.find({
      relations: ['project', 'assignee'],
    });
  }
  async findAllByProject(projectId: number) {
    return this.taskRepo.find({
      where: { project: { id: projectId } },
      relations: ['project', 'assignee'],
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'project.created_by', 'assignee'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id);

    if (
      task.assignee?.id !== user.id &&
      task.project.created_by.id !== user.id
    ) {
      throw new ForbiddenException('Not authorized to update this task');
    }

    Object.assign(task, dto);

    if (dto.assigneeId) {
      const newAssignee = await this.userRepo.findOne({
        where: { id: dto.assigneeId },
      });
      if (!newAssignee) throw new NotFoundException('Assignee not found');
      task.assignee = newAssignee;
    }

    return this.taskRepo.save(task);
  }

  async remove(id: number, user: User) {
    const task = await this.findOne(id);
    if (task.project.created_by.id !== user.id) {
      throw new ForbiddenException(
        'Only the manager who created the project can delete task',
      );
    }

    return this.taskRepo.remove(task);
  }
}
