<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import * as util from '@/util/utils.js';


//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();
var user = util.loadObj('user');

//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {

});

</script>
<template>
    <div>
        SJP安全工作程序<br/>
        危害告知<br/>
        危害辨識流程圖<br/>
        危害辨識表-A表<br/>
        風險評估表-B表<br/>
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
