
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'default-passive-events'; //prevent: [Violation]Added non-passive event listener to a scroll-blocking

// 清除舊版直接存於 localStorage / sessionStorage 的資料（改由 Pinia 以 pi_ 前綴管理）
['user', 'hist', 'prjoption'].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });

// Pinia：以 sessionStorage 持久化，讓各分頁的登入身分與選擇狀態互相獨立
const pinia = createPinia();
pinia.use(({ store }) => {
    const key = `pi_${store.$id}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
        store.$patch(JSON.parse(saved));
    }
    store.$subscribe((mutation, state) => {
        sessionStorage.setItem(key, JSON.stringify(state));
    });
});

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}


app
.use(pinia)
.use(ElementPlus)
.use(router)
.mount("#app");
