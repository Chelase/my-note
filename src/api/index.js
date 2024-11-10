import axios from 'axios'
import {ElMessage} from "element-plus";
import useUserStore from '@/stores/user';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASEURL,
    timeout: 1000 * 60,
    responseType: 'json',
})

api.interceptors.request.use(
    (request) => {
        // 全局拦截请求发送前提交的参数
        // const userStore = useUserStore()
        // 设置请求头
        // if (request.headers) {
        //     if (userStore.isLogin) {
        //         request.headers.Authorization = `Bearer ${userStore.Token}`
        //     }
        // }
        return request
    },
)

api.interceptors.response.use(
    (response) => {
        if (response.data instanceof Blob) { return response.data }
        if (response.data.Success === false) {
            if (response.data.Msg !== '') {
                // 错误提示
                // Message.error(response.data.Msg)
                ElMessage.error(response.data.Msg)
                return Promise.reject(response.data)
            }
        }
        return Promise.resolve(response.data)
    },
    (error) => {
        let message = error.message
        if (error.response.status === 401) {
            useUserStore().logout()
            ElMessage.error('请前往登录')
            return false
        }
        console.log(43,error);
        if (message === 'Network Error') {
            message = '服务器故障'
        }
        else if (message.includes('timeout')) {
            message = '接口请求超时'
        }
        else if (message.includes('Request failed with status code')) {
            // message = `接口${message.substr(message.length - 3)}异常`
            message = error.response.data
        }
        ElMessage.error(message)
        return Promise.reject(error)
    },
)

export default api
