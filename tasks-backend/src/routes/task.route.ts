import { Router } from "express";
import { TaskService } from "../services/taskService.ts";
import { sendError } from "../utils";

export const TaskRoute = Router()

TaskRoute.get('/', async (req: any, res) => {
    try {
        res.json(await TaskService.getTasksByUserId(req.user.id))
    } catch (e) {
        sendError(res, e)
    }
})

TaskRoute.get('/:id', async (req: any, res) => {
    try {
        const id = Number(req.params.id)
        res.json(await TaskService.getTaskById(req.user.id, id))
    } catch (e) {
        sendError(res, e)
    }
})

TaskRoute.post('/', async (req: any, res) => {
    try {
        await TaskService.createTask(req.user.id, req.body)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})

TaskRoute.put('/:id', async (req: any, res) => {
    try {
        const id = Number(req.params.id)
        await TaskService.updateTask(req.user.id, id, req.body)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})

TaskRoute.delete('/:id', async (req: any, res) => {
    try {
        const id = Number(req.params.id)
        await TaskService.deleteTask(req.user.id, id)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})