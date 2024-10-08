import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import userApi from '@/api/modules/user.js'
import router from "@/router/index.js"

const useUserStore = defineStore('user', () => {
    const UserId = ref(localStorage.UserId ?? '')
    const UserName = ref(localStorage.UserName ?? '')
    const UserInfo = ref({})
    const Token = ref(localStorage.Token ?? '')
    const isLogin = computed(() => !!Token.value)

    const register = async (data) => await userApi.userRegister(data)

    const Login = async (data) => {
        const {token,userInfo} = await userApi.Login(data)
        Token.value = token
        UserInfo.value = userInfo
        UserId.value = userInfo.userId
        UserName.value = userInfo.name
        localStorage.setItem('Token', Token.value)
        localStorage.setItem('UserId', UserInfo.value.userId)
        localStorage.setItem('UserName', UserInfo.value.name)
    }

    const logout = async () => {
        localStorage.removeItem('Token')
        localStorage.removeItem('UserId')
        localStorage.removeItem('UserName')
        Token.value = ''
        await router.push('login')
    }

    const delUser = async (id) => {
        await logout()
        await userApi.userDel(id)
    }

    return {
        UserId,
        UserName,
        UserInfo,
        Token,
        isLogin,
        register,
        Login,
        logout,
        delUser
    }
})

export default useUserStore