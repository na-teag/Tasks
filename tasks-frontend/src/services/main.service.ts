import axios, { AxiosError, type AxiosResponse } from "axios"
import { AuthService } from "./auth.service"
import Router from "@/router";

const client = axios.create({
    baseURL: 'https://localhost:5000/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus: (status: number) => {
        return Math.floor(status/10) === 20
    }
})

export class MainService {

    static async login(username: string, password: string) {
        return await client.request({
            url: '/user/login',
            method: 'post',
            data: {
                username: username,
                password: password
            }
        })
    }

    static async register(username: string, email: string, password: string) {
        return await client.request({
            url: '/user/register',
            method: 'post',
            data: {
                username: username,
                email: email,
                password: password
            }
        })
    }

    static async useAxios<T>(
        url: string,
        method: 'get' | 'post' | 'put' | 'delete' = 'get',
        data: any = {}): Promise<AxiosResponse<T, any>> {

        let rsp: AxiosResponse

        try {
            rsp = await client.request<T>({
                url: url,
                method: method,
                headers: {
                    'Authorization': `Bearer ${AuthService.getAccessToken()}`
                },
                data: data
            }) as AxiosResponse
        } catch (e) {
            rsp = (e as AxiosError).response as AxiosResponse
        }

        if (rsp == undefined) {
            Router.push('/login')
            throw new Error('BACKEND_UNREACHABLE')
        }

        if (rsp.status == 403) {
            // Expired access token, refresh and retry
            try {
                const tokenRequest = await client.request({
                    url: '/user/refresh',
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${AuthService.getRefreshToken()}`
                    }
                })

                AuthService.createAuth(tokenRequest.data)

                rsp = await client.request<T>({
                    url: url,
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${AuthService.getAccessToken()}`
                    },
                    data: data
                })

            } catch(e) {
                AuthService.removeAuth()
                throw new Error('REFRESH_FAILED')
            }
        }

        if (rsp.status == 404) {
            throw new Error('NOT_FOUND')
        }

        return rsp
    }
}