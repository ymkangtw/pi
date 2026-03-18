<script setup>
import { ref, onMounted } from 'vue';

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    param: {
        type: Array,
        default: []
    }
});

//--------------------------------
// Local Variable
//--------------------------------
const sGroup = ref();
//const groupList = ['Y631', 'Y632', 'Y633', 'Y634', 'Y635', 'Y636', 'Y637', 'Y63S', 'All', 'ME'];
//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    //console.log(sGroup.value);
});

const OnClick = () => {
    //console.log(sGroup.value);
    emits('onChange', sGroup.value);
}

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
    sGroup
});


</script>

<template>
    <div>
        
    </div>
</template>

<style scoped></style>
