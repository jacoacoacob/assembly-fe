import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routerV1 } from './router-v1';
import { routerV2 } from './router-v2';
import { pinia } from "./pinia";

import './assets/main.css'

const app = createApp(App)

app.use(pinia)
app.use(routerV2);

app.mount('#app')
