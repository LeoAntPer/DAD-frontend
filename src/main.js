import axios from 'axios'
import { io } from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import ToastPlugin from 'vue-toast-notification';

const app = createApp(App)

const apiDomain = "http://dad-backend.test"
const wsConnection = import.meta.env.VITE_WS_CONNECTION

app.provide('socket', io(wsConnection))

app.provide(
  'axios',
  axios.create({
    baseURL: apiDomain + '/api',
    headers: {
      'Content-type': 'application/json'
    }
  })
)
app.provide('serverBaseUrl', apiDomain)
app.use(ToastPlugin);
app.mount('#app')
