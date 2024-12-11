import api from '../index.js';

export default {
  getMessage: () => api.get('/Message/GetMessage'),
  AddMessage: (data) => api.post('/Message/AddMessage', data),
}