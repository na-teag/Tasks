import type { TaskModel } from "@/models/task.model";
import { MainService } from "./main.service";

export class TaskService {
    static async getTask() {
        return await MainService.useAxios<TaskModel[]>('/task')
    }

    static async getTaskById(id: number) {
        return await MainService.useAxios<TaskModel>(`/task/${id}`)
    }

    static async createTask(model: any) {
        return await MainService.useAxios(`/task`, 'post', model)
    }

    static async updateTask(id: number, model: any) {
        return await MainService.useAxios(`/task/${id}`, 'put', model)
    }

    static async deleteTask(id: number) {
        return await MainService.useAxios(`/task/${id}`, 'delete')
    }
}