<script setup>
import { ref, reactive, onMounted } from 'vue';
import EmployeeSvc from '@/service/employee.service.js';
import { useUserStore } from '@/stores/user.js';
import { ElNotification } from 'element-plus';

//--------------------------------
// Local Variable
//--------------------------------
const employeeSvc = new EmployeeSvc();
const userStore = useUserStore();
const user = ref({ ...userStore.identity });   // 編輯用副本，更新成功後才寫回 store

//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    
});

const Update = () => {
    console.log(user.value);
    employeeSvc
        .update(user.value)
        .then((data) => {
            if (data == 'updated') {
                ElNotification({title: 'Success', message: '資料更新成功', type: 'success', duration: 1500});
                userStore.updateIdentity(user.value);
            } else {
                ElNotification({title: 'Error', message: '資料更新失敗', type: 'error', duration: 1500});
            }
        });
};

</script>
<template>
    <div class="form-container">
        <el-form class="form" label-width="100px" label-position="left">
            <el-row>
                <el-col :span="6" class="form-font">組別</el-col>
                <el-col :span="18" class="form-font"><el-input v-model="user.ofgroup1" /></el-col>
            </el-row>            
            <el-row>
                <el-col :span="6" class="form-font">職工編號</el-col>
                <el-col :span="18" class="form-font"><el-input v-model="user.employeeno" /></el-col>           
            </el-row>
            <el-row>
                <el-col :span="6" class="form-font">姓名</el-col>
                <el-col :span="18" class="form-font"><el-input v-model="user.name" /></el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="form-font">生日</el-col>
                <el-col :span="18" class="form-font"><el-date-picker type="date" style="width: 100%" v-model="user.birthday" /></el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="form-font">住址</el-col>
                <el-col :span="18" class="form-font"><el-input v-model="user.address" /></el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="form-font">電話(H)</el-col>
                <el-col :span="18" class="form-font"><el-input v-model="user.phone" /></el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="form-font">電話(M)</el-col>
                <el-col :span="18" class="form-font"><el-input v-model="user.mobilephone" /></el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-button class="btn-font" type="primary" style="width: 120px" @click="Update">更新
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<style scoped>
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
}

.form {
    width: 400px;
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

.el-row {
    margin-bottom: 10px;
}

/*
.el-col {
    margin-right: 20px;
}
*/
</style>
