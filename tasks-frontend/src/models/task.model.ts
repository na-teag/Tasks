import type {TaskStatus} from "@/models/TaskStatus.model.ts";

export interface TaskModel {
    taskId: number
    userId: number
    title: string
    description: string
    status: TaskStatus
    createdAt: Date
    updatedAt: Date
}