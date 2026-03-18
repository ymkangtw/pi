import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
    state: () => ({
        user: {},
        loginStage: false,
        jobno: '',
        subjobno: 0,
        //employeeno: '12345',
        //name: 'kang',
        //ofgroup: 'Y63S',
        //titleid: 'engineer'
    })
}); 
