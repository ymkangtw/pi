import { defineStore } from 'pinia';

// 登入身分：只有登入 / 登出 / 帳號編輯會變動，與畫面選擇狀態分離避免互相覆蓋
export const useUserStore = defineStore('user', {
    state: () => ({
        identity: null      // 登入後存放整筆 employee 紀錄
    }),
    getters: {
        isLogin: (state) => !!state.identity
    },
    actions: {
        login(employee) {
            this.identity = employee;
        },
        updateIdentity(patch) {
            this.identity = { ...this.identity, ...patch };
        },
        logout() {
            this.identity = null;
        }
    }
});
