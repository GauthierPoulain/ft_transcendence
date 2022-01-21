import { createApp } from 'vue'
import { router } from "./router"

import App from './index.vue'

const app = createApp(App)
app.config.globalProperties.window = window
app.use(router)
app.mount('#app')
