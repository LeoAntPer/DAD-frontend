import axios from 'axios'
import { io } from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'bootstrap'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import ToastPlugin from 'vue-toast-notification';
import router from './router'
import ConfirmationDialog from './components/global/ConfirmationDialog.vue'
import FieldErrorMessage from './components/global/FieldErrorMessage.vue'

const app = createApp(App)

const apiDomain = import.meta.env.VITE_API_DOMAIN
const wsConnection = import.meta.env.VITE_WS_CONNECTION

//app.provide('socket', io(wsConnection))

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
app.use(router)
app.use(createPinia())
app.component('ConfirmationDialog', ConfirmationDialog)
app.component('FieldErrorMessage', FieldErrorMessage)
app.mount('#app')
