<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
