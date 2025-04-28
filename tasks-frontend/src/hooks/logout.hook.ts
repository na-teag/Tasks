import {AuthService} from "@/services/auth.service"
import {useRouter} from "vue-router"

export function useLogout() {
    const router = useRouter()

    return (e: any | undefined) => {
        if (e != undefined) {
            alert(e.message)
        }
        AuthService.removeAuth()
        router.push('/login')
    }
}