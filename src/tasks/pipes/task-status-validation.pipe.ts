import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../tasks.model";

/**
 * @description check the status input is valid or not
 */
export class TaskStstusValidationPipe implements PipeTransform {
    // list valid status from enum
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN,
    ];

    // define checking logic in transform method
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        // invalid error handler
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`)
        }

        return value;
    }

    private isStatusValid(status: any) {
        return this.allowedStatuses.includes(status);
    }
}