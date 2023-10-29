import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskActive } from './entities/task-active.entity';
import { TaskLogged } from './entities/task-logged.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Scheduled Tasks
  @Post('scheduled')
  async createScheduledTask(@Body() data: any): Promise<TaskScheduled> {
    return this.tasksService.insertScheduledTask(data);
  }

  @Get('scheduled')
  async getScheduledTasks(@Query() opts?: any): Promise<TaskScheduled[]> {
    return this.tasksService.findScheduledTasks(opts);
  }

  @Put('scheduled')
  async updateScheduledTask(@Body() data: any): Promise<any> {
    return this.tasksService.updateScheduledTask(data);
  }

  @Delete('scheduled/:id')
  async deleteScheduledTask(@Param('id') id: number): Promise<any> {
    return this.tasksService.removeScheduledTask(id);
  }

  // Active Tasks
  @Post('active')
  async createActiveTask(@Body() data: any): Promise<number[]> {
    return this.tasksService.insertActiveTask(data);
  }

  @Get('active')
  async getActiveTask(@Query('scheduledTaskId') scheduledTaskId: number): Promise<any> {
    return this.tasksService.findActiveTask(scheduledTaskId);
  }

  @Delete('active/:id')
  async deleteActiveTask(@Param('id') id: number): Promise<any> {
    return this.tasksService.removeActiveTask(id);
  }

  // Logged Tasks
  @Get('logged')
  async createLoggedTask(): Promise<TaskLogged[]> {
    return this.tasksService.findLoggedTasks();
  }
}
