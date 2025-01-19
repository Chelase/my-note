import api from '../index.js'

export default {
    getTiktokVideo: (video_id) => api.get(`https://open.douyin.com/api/douyin/v1/video/get_iframe_by_video${video_id}`,)
}