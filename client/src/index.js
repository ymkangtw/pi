
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'default-passive-events'; //prevent: [Violation]Added non-passive event listener to a scroll-blocking

// 一次性清除改用 sessionStorage 前遺留在 localStorage 的舊資料
['user', 'hist', 'prjoption'].forEach(k => localStorage.removeItem(k));

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}


app
.use(ElementPlus)
.use(router)
.mount("#app");


