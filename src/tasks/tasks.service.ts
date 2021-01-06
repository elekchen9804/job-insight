import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from 'src/tasks/tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() {
        return this.tasks;
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search)
            )
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);
        // Error handling
        if (!found) {
            throw new NotFoundException(`The task ID ${id} is not found`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
        // Why return task?
        // frontend can skip one more call for all tasks
    }

    deleteTaskById(id: string): void {
        // check the task exist
        const found = this.getTaskById(id);

        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatusById(id: string, status: TaskStatus): void {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === id) {
                this.tasks[i].status = status;
                return;
            }
        }
    }
}
