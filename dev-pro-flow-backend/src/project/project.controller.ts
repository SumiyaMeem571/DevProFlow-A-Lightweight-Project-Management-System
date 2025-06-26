import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from 'src/auth/Guard/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create-project')
  create(@Body() dto: CreateProjectDto, @Req() req) {
    return this.projectService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Patch('update-project/:id')
  update(@Param('id') id: number, @Body() dto: UpdateProjectDto, @Req() req) {
    return this.projectService.update(id, dto, req.user);
  }

  @Delete('remove-project/:id')
  remove(@Param('id') id: number, @Req() req) {
    return this.projectService.remove(id, req.user);
  }
}
