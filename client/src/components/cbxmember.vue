<script setup>
import { ref, onMounted, watch } from 'vue';
import EmployeeSvc from '@/service/employee.service.js';

const employeeSvc = new EmployeeSvc();

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    param: {
        type: Object,
        default: {}
    }
});

//--------------------------------
// Local Variable
//--------------------------------
const sGroup = ref();
const optionValue = ref('');
const options = ref([
    { value: '1', label: 'Option1', },
    { value: '2', label: 'Option2', },
    { value: '3', label: 'Option3', },
    { value: '4', label: 'Option4', },        
]);

//const groupList = ['Y631', 'Y632', 'Y633', 'Y634', 'Y635', 'Y636', 'Y637', 'Y63S', 'All', 'ME'];
//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    //console.log(sGroup.value);
});
/*
watch(() => props.param.sGroup, (newVal, oldVal) => {
    console.log(`sGroup 變化了：${oldVal} -> ${newVal}`);
    //options.value = employeeSvc.getBy({ofgroup1: props.param.sGroup});
    //console.log('options: ', options.value);
    updateOptions(newVal);
});
*/
const updateOptions = async (newVal) => {
    options.value = await employeeSvc.getBy({ofgroup1: newVal});
    console.log('options: ', options.value);
};

const OnChange = () => {
    //console.log(sGroup.value);
    console.log(props.param.sGroup);
    emits('onChange', optionValue);
};

//--------------------------------
// Component Event
//--------------------------------
const emits = defineEmits(
    ['onChange']
);

//--------------------------------
// Component Expose Property (Input/Output)
//--------------------------------

defineExpose({
    options
});


</script>

<template>
    <div>
        <el-select v-model="optionValue" @change="OnChange" clearable placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
    </div>
</template>

<style scoped></style>
