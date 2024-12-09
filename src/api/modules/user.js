import api from '../index.js'

export default {
    userRegister: (data) => api.post('/User/Register',data),
    userLogin: (data) => api.post('/User/Login',data),
    userInfo: (id) => api.get(`/User/GetUserInfo/${id}`),
    userDel: (id) => api.post('/User/DelUser',id),
    userEdit: (data) => api.post('/User/UpdateUser',data)
}
