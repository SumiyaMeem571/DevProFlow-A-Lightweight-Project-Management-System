import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeOrmconfig from 'typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmconfig),
    AuthModule,
    UserModule,
    AdminModule,
    ProjectModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
