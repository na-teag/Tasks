import {AppDataSource} from "../db";
import {Task} from "../entities/Task";

const repo = AppDataSource.getRepository(Task)

export class TaskService {
    static async getTasksByUserId(id: number) {
        return await repo.find({
            select: {
                taskId: true,
                userId: true,
                title: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                userId: id
            },
            order: {
                createdAt: 'desc'
            }
        })
    }

    static async getTaskById(userId: number, taskId: number) {
        const data = await repo.findOne({
            where: {
                taskId: taskId,
                userId: userId,
            }
        })

        if (data == undefined)
            throw new Error("TASK_NOT_FOUND")

        return data
    }

    static async createTask(userId: number, model: Task) {
        await repo.save({
            userId: userId,
            title: model.title,
            description: model.description,
            status: 'pending'
        })
    }

    static async updateTask(userId: number, TaskId: number, model: Task) {
        const task = await this.getTaskById(userId, TaskId)

        if (!task)
            throw new Error("TASK_NOT_FOUND")

        task.title = model.title
        task.description = model.description
        task.status = model.status
        await repo.save(task)
    }

    static async deleteTask(userId: number, TaskId: number) {
        const test = await repo.delete({ userId: userId, taskId: TaskId })
        if (test.affected === 0)
            throw new Error("TASK_NOT_FOUND")
    }
}