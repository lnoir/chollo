import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskLogged } from './entities/task-logged.entity';
import { TaskStep } from './entities/task-step.entity';
import { TaskStepInDto } from './dtos/task-step.in.dto';
import { Job } from '../queue/entities/job.entity';
import { TaskScheduledInDto } from './dtos/task-scheduled.in.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Scheduled Tasks
  @Post('scheduled')
  async createScheduledTask(@Body() data: TaskScheduledInDto): Promise<TaskScheduled> {
    return this.tasksService.insertScheduledTask(data);
  }

  @Get('scheduled')
  async getScheduledTasks(@Query() opts?: any): Promise<TaskScheduled[]> {
    return this.tasksService.findScheduledTasks(opts);
  }

  @Put('scheduled')
  async updateScheduledTask(@Body() data: TaskScheduledInDto): Promise<any> {
    return this.tasksService.updateScheduledTask(data);
  }

  @Get('scheduled/:id')
  async getTaskScheduled(@Param('id') id: number): Promise<TaskScheduled> {
    return this.tasksService.findTaskScheduled(id);
  }

  @Delete('scheduled/:id')
  async deleteScheduledTask(@Param('id') id: number): Promise<any> {
    await this.tasksService.deleteJobByTaskId(id);
    await this.tasksService.deleteScheduledTask(id);
  }

  @Post('scheduled/:id/enable')
  async enableTaskScheduled(@Param('id') id: number): Promise<any> {
    return this.tasksService.insertJobForTask(id);
  }

  @Delete('scheduled/:id/disable')
  async disableTaskScheduled(@Param('id') id: number): Promise<any> {
    return this.tasksService.deleteJobByTaskId(id);
  }

  @Get('scheduled/:id/job')
  async getTaskScheduledJob(@Param('id') id: number): Promise<Job> {
    return this.tasksService.getJobByTaskId(id)
  }

  @Get('scheduled/:id/logs')
  async getTaskLogs(@Param('id') id: number): Promise<any> {
    return this.tasksService.findLoggedTasks({task: id});
  }
  
  @Get('outputs/:jobId')
  async getTaskOutput(
    @Param('jobId') jobId: number
  ): Promise<any> {
    return this.tasksService.findOutputsByJobId(jobId);
  }
  
  // Task steps
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
