<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { trimJSON, saveObj, loadObj, delObj, clearAll } from '@/util/utils.js';

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    data: { type: Array },
});

//--------------------------------
// Component Event
//--------------------------------

//const emits = defineEmits(
//    ['customEvent']
//);

//--------------------------------
// Component Expose Property (Input/Output)
//--------------------------------

defineExpose({
    //user
});

//--------------------------------
// Local Variable
//--------------------------------

const router = useRouter();
const user = ref(null);     // 登入使用者
user.value = loadObj('user');

//--------------------------------
// Local Function
//--------------------------------

onMounted(() => {

});

const Logout = () => {
    user.value = null;
    delObj('user');
    //delObj('hist');
    router.push('/');
};

//const EventFunc = () => {
//    let data = '';
//    emits('customEvent', data);
//};

</script>
<template>

    <div>
        <el-dropdown>
            <span class="el-dropdown-link">
                <i class="mdi mdi-36px mdi-account"></i>
                <span v-if="user">
                    <div>{{ user.employeeno }}</div>
                    <div>{{ user.name }}</div>
                </span>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <router-link to="/UA01"><el-dropdown-item>登入</el-dropdown-item></router-link>
<!--
                    <router-link to="/UA02"><el-dropdown-item v-if="user">帳號管理</el-dropdown-item></router-link>
-->
                    <el-dropdown-item divided @click="Logout">登出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

    </div>

</template>
<style scoped>
.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
}
</style>
