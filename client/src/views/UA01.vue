<script setup>
import { ref, reactive, onMounted } from 'vue';
import EmployeeSvc from '@/service/employee.service.js';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useField } from 'vee-validate';

//--------------------------------
// Local Variable
//--------------------------------
const employeeSvc = new EmployeeSvc();
const router = useRouter();
const userStore = useUserStore();
const sel = useSelectionStore();

//const employeeno = ref();
const password = ref();

//--------------------------------
// Local Function
//--------------------------------

onMounted(() => {
    // 自動帶入上次成功登入的職工編號（localStorage 跨分頁共享，僅作預填提示，非登入狀態）
    const last = localStorage.getItem('pi_lastEmployeeno');
    if (last) {
        employeeno.value = last;
    }
});

const validateField = (value) => {
    if (value && value.trim()) {
        return true;
    }
    return '欄位不可空白!';
};
const { value: employeeno, errorMessage: errmsg_employeeno } = useField('employeeno', validateField);

const Login = () => {
    let error = [errmsg_employeeno.value];
    let error_count = error.filter((item) => { return item !== undefined}).length;
    //console.log(error_count);
    if (error_count < 1) {
        employeeSvc
        .getBy({ employeeno: employeeno.value })
        .then((data) => {
            if (data.length > 0) {
                userStore.login(data[0]);
                sel.reset();
                localStorage.setItem('pi_lastEmployeeno', employeeno.value);
                //console.log('login: ', userStore.identity);
                router
                    .push({ path: '/' })
                    .then(() => {
                        router.go(0);
                    });

            } else {
                ElNotification({ title: '登入失敗', message: '請重新登入', type: 'error', duration: 1500 });
                userStore.logout();
            }
        });
    }
};

</script>
<template>
    <div class="login-container">
        <el-form class="login-form" label-width="100px" style="max-width: 400px">

            <el-row>
                <el-col :span="8" class="form-font">職工編號</el-col>
                <el-col :span="16" class="form-font">
                    <el-input v-model="employeeno" />
                    <span class="errorMessage">{{ errmsg_employeeno }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" class="form-font">密碼</el-col>
                <el-col :span="16" class="form-font">
                    <el-input type="password" v-model="password" />
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-button class="btn-font" type="primary" style="width:100%" @click="Login()">登入
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
}

.login-form {
    max-width: 300px;
}

.form-font {
    display: flex;
    justify-content: left;
    align-content: center;
    flex-wrap: wrap;
    font-size: 18px;
    font-weight: bold;
}

.btn-font {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    font-size: 18px;
    font-weight: bold;
}

.errorMessage {
    font-size: 12px;
    color: red;
}

.el-row {
    margin-bottom: 25px;
}
</style>
