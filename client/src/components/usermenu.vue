<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as util from '@/util/utils.js';

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
user.value = util.loadObj('user');

//--------------------------------
// Local Function
//--------------------------------

onMounted(() => {

});


//const EventFunc = () => {
//    let data = '';
//    emits('customEvent', data);
//};

</script>
<template>

        <el-button type="primary" class="mdi mdi-24px mdi-apps" />


</template>
<style scoped>
.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
}
</style>
