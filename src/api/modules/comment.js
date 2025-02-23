import api from '../index.js'

export default {
    GetComment: (params) => api.get('/Comment/GetComment',{params}),
    AddComment: (data) => api.post('/Comment/AddComment', data),
    DelComment: (id) => api.post(`/Comment/DelComment/{id}${id}`),
    GetSubComment: (params) => api.get('/Comment/GetSubComment',{params}),
    AddSubComment: (data) => api.post('/Comment/AddSubComment', data),
}