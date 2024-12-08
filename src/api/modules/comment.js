import api from '../index.js'

export default {
    GetComment: (params) => api.get('/Comment/GetComment',{params}),
    AddComment: (data) => api.post('/Comment/AddComment', data),
    DelComment: (id) => api.post(`/Comment/DelComment/{id}${id}`),
    LikeComment: (id) => api.post(`/Comment/LikeComment/{id}${id}`)
}