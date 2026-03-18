<script setup>
import { ref, onMounted } from 'vue';
//import * as util from '@/util/utils.js';

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
//var user = util.loadObj('user');
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
    //user.sGroup = sGroup.value;
    //util.saveObj('user', user);
    //console.log(user.sGroup);
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
        <el-row>
            <el-radio-group v-model="sGroup">
                <el-radio-button 
                    v-for="(item, index) in param"
                    :key="item"
                    :label="item"
                    :value="item"
                    @change="OnClick"
                >
                </el-radio-button>
            </el-radio-group>
        </el-row>
    </div>
</template>

<style scoped></style>
