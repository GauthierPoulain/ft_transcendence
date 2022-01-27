import { createApp } from 'vue'
import { router } from "./router"
import { store } from "./store"

import App from './index.vue'

const app = createApp(App)
app.config.globalProperties.window = window
app.use(store)
app.use(router)
app.mount('#app')
