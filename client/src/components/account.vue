<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';

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
const userStore = useUserStore();
const sel = useSelectionStore();
const user = computed(() => userStore.identity);     // 登入使用者

//--------------------------------
// Local Function
//--------------------------------

onMounted(() => {

});

const Logout = () => {
    userStore.logout();
    sel.reset();
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
