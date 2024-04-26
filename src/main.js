import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import { loadFonts } from './plugins/webfontloader'
import router from './router'

loadFonts()

const pinia = createPinia()

createApp(App).use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app')
