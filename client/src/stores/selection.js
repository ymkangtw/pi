import { defineStore } from 'pinia';

// 畫面選擇狀態：各頁面讀寫，與登入身分分離，頁面操作不會蓋掉身分資料
export const useSelectionStore = defineStore('selection', {
    state: () => ({
        sJobno: '',
        sSubjobno: '',
        sGroup: '',
        sTeam: '',
        sMember: '',
        hist: { link: '', listtype: '' },
        prjoption: null
    }),
    actions: {
        reset() {
            this.$reset();
        }
    }
});
