import type { AuthModel } from "@/models/auth.model";

export class AuthService {
    private static STORAGE_KEY = 'auth'

    static createAuth(model: AuthModel) {
        this.removeAuth()
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(model))
    }

    static getAuth() {
        const auth = localStorage.getItem(this.STORAGE_KEY)
        if (auth == undefined)
            throw new Error('NO_AUTH_FOUND')

        return JSON.parse(auth)
    }

    static hasAuth() {
        return localStorage.getItem(this.STORAGE_KEY) != undefined
    }

    static removeAuth() {
        localStorage.removeItem(this.STORAGE_KEY)
    }

    static getUser(): string {
        return this.getAuth().name
    }

    static getAccessToken(): string {
        return this.getAuth().access
    }

    static getRefreshToken(): string {
        return this.getAuth().refresh
    }
}