<script setup>
import { ref, reactive, onMounted } from 'vue';
import EmployeeSvc from '@/service/employee.service.js';
import { trimJSON, saveObj, delObj, clearAll } from '@/util/utils.js';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useField } from 'vee-validate';

//--------------------------------
// Local Variable
//--------------------------------
const employeeSvc = new EmployeeSvc();
const router = useRouter();

const user = ref();
const hist = ref();
//const employeeno = ref();
const password = ref();

//--------------------------------
// Local Function
//--------------------------------

onMounted(() => {
    //console.log('pview user:', user);
    console.log(user.value);
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
                user.value = data[0];
                user.value.sTeam = '';
                user.value.sGroup = '';
                user.value.sMember = '';
                user.value.sJobno = '';
                user.value.sSubjobno = '';
                hist.value = { link: '', listtype: ''};

                saveObj('user', user.value);
                saveObj('hist', hist.value);
                //console.log('login: ', user.value);
                router
                    .push({ path: '/' })
                    .then(() => {
                        router.go(0);
                    });

            } else {
                ElNotification({ title: '登入失敗', message: '請重新登入', type: 'error', duration: 1500 });
                delObj('user');
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
