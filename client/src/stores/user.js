import { defineStore } from 'pinia';
import EmployeeService from '@/service/employee.service.js';

const svcEmployee = new EmployeeService();

export const useStore = defineStore('main', {
    //id: "store",
    state: () => ({
        employeeno: "",
        ofgroup: "",
        jobno: "",
        subjobno: 0
    }),
    actions: {
        async login(id, password) {
            
        },
        logout() {

        }
    }
}); 

//export default useStore;