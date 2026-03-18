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
const sTeam = ref();


//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    //console.log(sGroup.value);
});

const OnClick = () => {
    emits('onChange', sTeam.value);
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
    sTeam
});


</script>

<template>
    <div>
        <el-row>

            <el-select v-model="sTeam" @change="OnClick" placeholder="Select">
                <el-option 
                    v-for="item in param" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                    @change="OnClick" 
                >
                </el-option>
            </el-select>

        </el-row>
    </div>
</template>

<style scoped></style>
