import api from '../index.js'

export default {
    uploadPhoto: (data) => api.post('/Public/UploadPhoto', data),
    likes: (data) => api.post('/Public/Like', data),
}