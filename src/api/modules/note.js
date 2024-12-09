import api from '../index.js'

export default {
    GetNote: (params) => api.get('/Note/GetNote',{params}),
    AddNote: (data) => api.post('/Note/AddNote', data),
    DelNote: (id) => api.post(`/Note/DelNote/${id}`)
}