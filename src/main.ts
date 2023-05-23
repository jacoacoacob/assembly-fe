import { createApp } from 'vue'

import App from './App.vue'
import { router } from './v2/router';
import { pinia } from "./pinia";

import './assets/main.css'
import { socket } from './socket';

const app = createApp(App)

app.use(pinia)
app.use(router);
app.use({
    install(app) {
        app.config.globalProperties.$socket = socket;
    },
});

declare module "vue" {
    interface ComponentCustomProperties {
        $socket: typeof socket
    }
}

app.mount('#app')
