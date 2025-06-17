// import { createApp } from 'vue'
import './style.css'
// import App from './App.vue'
// import ElementPlus from 'element-plus'
//
// const app = createApp(App);
//
// app.use(ElementPlus);
// app.mount(`#app`);
import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
