import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskActive } from './entities/task-active.entity';
import { TaskLogged } from './entities/task-logged.entity';
import { TaskStep } from './entities/task-step.entity';
import { TaskStepInDto } from './dtos/task-step.in.dto';

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

  @Get('scheduled/:id')
  async getTaskScheduled(@Param('Id') id: number): Promise<TaskScheduled> {
    return this.tasksService.findTaskScheduled(id);
  }

  @Delete('scheduled/:id')
  async deleteScheduledTask(@Param('id') id: number): Promise<any> {
    return this.tasksService.removeScheduledTask(id);
  }
  
  // Scheduled Tasks
  @Post('step')
  async createTaskStep(@Body() data: TaskStepInDto): Promise<TaskStep> {
    return this.tasksService.insertTaskStep(data);
  }

  /*
  @Get('step')
  async getTaskSteps(@Query() opts?: any): Promise<TaskStep[]> {
    return this.tasksService.find(opts);
  }

  @Put('step')
  async updateTaskStep(@Body() data: TaskStepInDto): Promise<TaskStep> {
    return this.tasksService.updateTaskStep(data);
  }*/

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
