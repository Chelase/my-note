import api from '../index.js'

export default {
    userRegister: (data) => api.post('/User/Register',data),
    userLogin: (data) => api.post('User/Login',data),
    userDel: (id) => api.post('/User/DelUser',id)
}