<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import CommonSvc from '@/service/common.service.js';
import _ from 'lodash';
import * as util from '@/util/utils.js';
import * as dayjs from 'dayjs';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';

//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();
const userStore = useUserStore();
const sel = useSelectionStore();
var user = userStore.identity;


const commonSvc = new CommonSvc();

const b = ref();        // basic data, 工程基本資料
const queryCount = ref();
const queryStr = ref();

const records = ref([]);// { inputdate: '', prompt: '', answer: '' }

//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    queryStr.value = '請說明什麼是TCP/IP';


});


const BackTo = () => {
    router.push('/PM03');
}

const onQuery = async () => {
    //console.log(queryStr.value);
    //orderitems.value = await orderitemsSvc.getBy({ name: `%${queryStr.value}%` });
    //queryCount.value = orderitems.value.length;
    //console.log(orderitems.value);
    /*
    let queryObj;
    if (sOption.value == 'employeeno') {
        queryObj = { [sOption.value]: queryStr.value.trim() };
        b.value = await commonSvc.getPersonalJobs(queryObj);
    } else {
        queryObj = { [sOption.value]: `%${queryStr.value}%` };
        b.value = await basicSvc.getBy(queryObj);
    }
    */


    b.value = "";
    let queryObj = {
        content: queryStr.value,
        token_num: 512,
    };
    let headers = { 
        responseType: 'stream',
        'Content-type': 'application/json', 
    };

    let response = await fetch('http://localhost:8000/message/', {
        method: 'POST',
        body: JSON.stringify(queryObj),
        headers: headers,
    });
    /*
    .then((response) => response.body)
    .then((body) => {
        console.log(body);
          
        const reader = body.getReader();
        console.log(reader);
        return body;
    });
    */
    //let reader = response.body.getReader();
    let reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
        const {value, done} = await reader.read();
        if (done) {
            break;
        }
        b.value += value;
        //console.log(value);
    }
    let obj = {
        inputdate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        prompt: queryStr.value,
        answer: b.value,
    };
    records.value.push(obj);
    console.log(records.value);
    console.log('Response fully received');

    //console.log(queryObj);

    //b.value = await commonSvc.llmMessage(queryObj);
    //console.log(b.value);
    
    
    //queryCount.value = b.value.length;

    //console.log(queryStr.value);
};

const handleClick = (value) => {
    //console.log(value.row.jobno);
    sel.sJobno = value.row.jobno;
    //console.log(user);
    //router.push('/PM02');
    //prjoption == '' ? router.push('/PM02/PD01') : router.push(prjoption);
    //_.isEmpty(prjoption) ? router.push('/PM02/PD01') : router.push(prjoption);  
    _.isEmpty(sel.hist.link) ? router.push('/PM02/PD01') : router.push(sel.hist.link);
};

</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <div class="item-align ma4">
                    <span class="ma8">
                        <el-text type="danger" tag="b" size="large">對話測試</el-text>
                    </span>
                    <span class="ma8">
                        <el-button type="primary" @click="BackTo">回上頁</el-button>
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row class="fstart">    
            <el-col :span="18">
                <div class="item-align ma4">
                    <span class="label fs16 ma4">
                        訊息:
                    </span>
                    <span class="value-l fs16 ma4">
                        <el-input v-model="queryStr" placeholder="" @keydown.enter="onQuery" />
                    </span>
                    <span>
                        <el-button type="primary" @click="onQuery">送出</el-button>
                    </span>
                </div>

            </el-col>

            <el-col :span="6">
                <div class="item-align ma4">
                <!--
                    <span class="label fs16 ma4">查詢數量:</span>
                    <span class="value fs16 ma4">{{queryCount}}</span>
                -->
                    
                </div>
            </el-col>

        </el-row>

        <el-row>
            <el-col :span="24">
                {{ b }}
                <template v-for="(item, index) in records" :key="item.inputdate" >
                    <el-card>
                        <template #header>
                            <div>{{ item.inputdate }}</div>
                        </template>
                        
                        <div>{{ item.prompt }}</div>
                        <div>{{ item.answer }}</div>
                    </el-card>


                </template>
            <!--
                <el-table v-if="b" :data="b" max-height="480" style="width: 100%" class="fs14 ma4">
                    <el-table-column fixed label="工程編號" prop="jobno" width="130" header-align="center" align="left" sortable>
                        <template #default="scope">
                            <el-button link type="primary" @click="handleClick(scope)">
                                {{ scope.row.jobno }}
                            </el-button>
                        </template>                    
                    </el-table-column>
                    <el-table-column fixed label="工程名稱" prop="jobname" width="360"  header-align="center" align="left" sortable />
                    <el-table-column label="申請單位" prop="appdept" width="80" header-align="center" align="center" sortable />
                    <el-table-column label="預算編號" prop="approvalno" width="120" header-align="center" align="center" sortable />
                    <el-table-column label="工令編號" prop="joborderno" width="120" header-align="center" align="center" sortable />
                    <el-table-column label="預算種類" prop="jobtype" width="80" header-align="center" align="center" sortable />
                    <el-table-column label="開始年度" prop="budgetyearst" width="60" header-align="center" align="center" sortable />
                    <el-table-column label="結束年度" prop="budgetyearsp" width="60" header-align="center" align="center" sortable />
                    <el-table-column label="總預算" prop="totalbudget" width="130" header-align="center" align="right" sortable />
                    <el-table-column label="儀電預算" prop="electricalbudget" width="120" header-align="center" align="right" sortable />
                </el-table>
            -->
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
