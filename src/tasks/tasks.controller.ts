import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from 'src/tasks/tasks.model';
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStstusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        // has at least one query
        if (Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilter(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    /** With DTO */
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.taskService.createTask(createTaskDto);
    }

    /** Without DTO */
    // @Post()
    // createTask(
    //     @Body('title') title: string,
    //     @Body('description') description: string
    // ): Task {
    //     return this.taskService.createTask(title, description);
    // }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void {
        this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/:status')
    updateTaskStatusById(
        @Param('id') id: string,
        @Body('status', TaskStstusValidationPipe) status: TaskStatus
    ): void {
        this.taskService.updateTaskStatusById(id, status);
    }
}
