import bcrypt from "bcrypt";
import type { Response } from "express";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../db";
import { User } from "../entities/User";
import type { LoginModel } from "../models/login.model";
import type { RegisterModel } from "../models/register.model.ts";

const repo = AppDataSource.getRepository(User)
const tokenSecret = process.env.JWT_SECRET
const accessTTL = process.env.JWT_ACCESS_TTL
const refreshTTL = process.env.JWT_REFRESH_TTL

export class UserService {

    static async getUserByUsername(username: string) {
        const data = repo.findOne({
            where: {
                username: username
            }
        })

        if (data == null)
            throw new Error("USER_NOT_FOUND")

        return data
    }

    static async login(model: LoginModel) {
        const user = await this.getUserByUsername(model.username)

        if (await bcrypt.compare(model.password, user!.password)) {
            const payload = {
                id: user?.userId,
                email: user?.email
            }

            return {
                username: user?.username,
                // @ts-ignore
                access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
                // @ts-ignore
                refresh: jwt.sign(payload, tokenSecret!, { expiresIn: refreshTTL })
            }
        }

        throw new Error('BAD_CREDENTIALS')
    }

    static async register(model: RegisterModel) {
        const dataEmail = await repo.existsBy({email: model.email})
        const dataUsername = await repo.existsBy({username: model.username})

        if (dataEmail)
            throw new Error("USER_EMAIL_EXISTS")
        if (dataUsername)
            throw new Error("USER_USERNAME_EXISTS")

        const hashedPassword = await bcrypt.hash(model.password, 12)
        await repo.save({
            email: model.email,
            password: hashedPassword,
            username: model.username
        })
    }

    static async verifyToken(req: any, res: Response, next: Function) {
        const whitelist = ['/api/user/login', '/api/user/refresh', '/api/user/register']

        if (whitelist.includes(req.path)) {
            next()
            return
        }

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == undefined) {
            res.status(401).json({
                message: 'NO_TOKEN_FOUND',
                timestamp: new Date()
            })
            return
        }

        jwt.verify(token, tokenSecret!, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    message: 'INVALID_TOKEN',
                    timestamp: new Date()
                })
                return
            }

            req.user = user
            next()
        })
    }

    static async refreshToken(token: string) {
        const decoded: any = jwt.verify(token, tokenSecret!)
        const user = await this.getUserByUsername(decoded.email)

        const payload = {
            id: user?.userId,
            email: user?.email,
            username: user?.username
        }

        return {
            name: user?.email,
            // @ts-ignore
            access: jwt.sign(payload, tokenSecret, { expiresIn: accessTTL }),
            refresh: token
        }
    }
}