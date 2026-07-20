<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BasicSvc from '@/service/basic.service.js';
import _ from 'lodash';
import * as util from '@/util/utils.js';


//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();

const basicSvc = new BasicSvc();

const b = ref();        // basic data, 工程基本資料

const sOption = ref();
const Options = ref([
    { label: '工程名稱', value: 'jobname' },
    { label: '工程編號', value: 'jobno' },
    { label: '預算編號', value: 'approvalno' },
    { label: '工令編號', value: 'joborderno' },
    { label: '申請單位', value: 'appdept' },
    { label: '預算種類', value: 'jobtype' },
]);

const queryCount = ref();

const queryStr = ref();

//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    sOption.value = 'jobname';
});


const BackTo = () => {
    router.push('/PM05');
}



</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <span class="ma8">
                    <el-button type="primary" @click="BackTo">回上頁</el-button>
                </span>
                <span class="ma8">
                    <el-text type="danger" tag="b" size="large">二級週報</el-text>
                </span>
            </el-col>
        </el-row>

    </div>
</template>
<style scoped>
.fs14 {
    font-size: 14px;
}
.fs16 {
    font-size: 16px;
}
.ma4 {
    margin: 4px;
}
.ma8 {
    margin: 8px;
}
.fstart {
    display: flex;
    align-items: center;
    justify-content: start;
}
.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
}
.label {
    width: 120px;
}
.label-l {
    width: 200px;
}
.value {
    width: 200px;
}
.value-l {
    width: 280px;
}
</style>
