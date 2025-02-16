import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'element-plus/dist/index.css'
import InsertMenu from '@/components/InsertMenu.vue'
import { emitter } from './utils/emitter'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('InsertMenu', InsertMenu)

app.provide('emitter', emitter) // 注入到全局

app.mount('#app')
