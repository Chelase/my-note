import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import userApi from '@/api/modules/user.js'
import router from "@/router/index.js"

const useUserStore = defineStore('user', () => {
    const UserId = ref(Number(localStorage.UserId) ?? '')
    const UserName = ref(localStorage.UserName ?? '')
    // const UserAvatar = ref(localStorage.UserAvatar ?? '')
    // const UserEmail = ref(localStorage.UserEmail ?? '')
    const UserInfo = ref(JSON.parse(localStorage.getItem('UserInfo')) ?? {})
    const Token = ref(localStorage.Token ?? '')
    const isLogin = computed(() => !!Token.value)

    const register = async (data) => await userApi.userRegister(data)

    const Login = async (data) => {
        const {token,userInfo} = await userApi.userLogin(data)
        Token.value = token
        UserInfo.value = userInfo
        UserId.value = userInfo.userId
        UserName.value = userInfo.userName
        console.log(userInfo);
        localStorage.setItem('Token', Token.value)
        localStorage.setItem('UserId', UserId.value)
        localStorage.setItem('UserName', UserName.value)
        localStorage.setItem('UserInfo', JSON.stringify(UserInfo.value))
    }

    const GetUserInfo = async (id) => {
        const { userInfo } = await userApi.userInfo(id)
        UserInfo.value = userInfo
        UserId.value = userInfo.userId
        UserName.value = userInfo.userName
        localStorage.setItem('UserId', UserId.value)
        localStorage.setItem('UserName', UserName.value)
        localStorage.setItem('UserInfo', JSON.stringify(UserInfo.value))
    }

    const logout = async () => {
        localStorage.removeItem('Token')
        localStorage.removeItem('UserId')
        localStorage.removeItem('UserName')
        localStorage.removeItem('UserInfo')
        Token.value = ''
        UserId.value = ''
        UserName.value = ''
        UserInfo.value = ''
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
        GetUserInfo,
        logout,
        delUser
    }
})

export default useUserStore
