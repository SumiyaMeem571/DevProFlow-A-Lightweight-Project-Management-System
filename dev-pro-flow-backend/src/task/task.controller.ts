import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtGuard } from 'src/auth/Guard/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //  Manager: Create a new task
  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }
  @Get()
  getAllTasks() {
    return this.taskService.findAll();
  }
  // Manager: Get all tasks for a project
  @Get('project/:projectId')
  getTasksByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.taskService.findAllByProject(projectId);
  }

  // All authenticated users: Get task by ID
  @Get(':id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  // Manager or Assigned Member: Update task
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.update(id, dto, req.user);
  }

  // Manager: Delete task
  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.taskService.remove(id, req.user);
  }
}
