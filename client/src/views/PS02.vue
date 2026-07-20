<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import team from '@/components/team.vue';
import TeamSvc from '@/service/uteam.service.js';
import CommonSvc from '@/service/common.service.js';

import ChartJobtype from '@/components/chartjobtype.vue';

import * as dayjs from 'dayjs';
import _ from 'lodash';
import * as util from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';


//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();
const userStore = useUserStore();
const sel = useSelectionStore();
var user = userStore.identity;

const chartjobtype = ref();

const teamSvc = new TeamSvc();
const commonSvc = new CommonSvc();

const refTeam = ref();
const prjList = ref();
const teamList = ref([]);

const sortPrjList = ref();

const dept = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Y5', 'Y6', 'Y1', 'Y9', 'A', 'C', 'T', 'F'];

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    let userteam = user.ofgroup1.substring(0, 3);
    refTeam.value.sTeam = userteam;
    await getTeamList();
    prjList.value = await commonSvc.getPrjinprogress({ ofgroup: `${userteam}%` });
    //console.log(prjList.value);
    chartjobtype.value.renderChart(prjList.value);
});

const BackTo = () => {
    router.push('/PM04');
}

const getTeamList = async (value) => {
    teamList.value = await teamSvc
        .getBy({visible: 1})
        .then((data) => {
            let result = [];
            for (let item of data) {
                result.push({value: item.teamno, label: item.teamno, name: item.name });
                //console.log(item);
            }
            return result;
        });
};

const onTeamChange = async (team) => {
    //console.log('onTeamChange:', team);     
    prjList.value = await commonSvc.getPrjinprogress({ ofgroup: `${team}%` });
    console.log(prjList.value);
    //let jobCount = _.countBy(prjList.value, 'jobtype');
    //console.log('jobCount:', jobCount);
    //console.log(Object.values(jobCount));
    //console.log(Object.keys(jobCount));

    chartjobtype.value.renderChart(prjList.value);
};

const onChartJobtypeClick = async (data) => {
    //console.log(data);
    sortPrjList.value = _.filter(prjList.value, (o) => { return o.jobtype == data; });
    //let sortData = prjList.value.filter((o) => { return o.jobtype == data; });
    //console.log(sortPrjList.value);
};

const handleClick = (value) => {
    //console.log(value.row.jobno);
    sel.sJobno = value.row.jobno;
    _.isEmpty(sel.hist.link) ? router.push('/PM02/PD01') : router.push(sel.hist.link);    
};

</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <div class="item-align ma4">
                    <span class="ma8">
                        <el-text type="danger" tag="b" size="large">各廠處進行工程分析</el-text>
                    </span>
                    <span class="ma8">
                        <el-button type="primary" @click="BackTo">回上頁</el-button>
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="item-align ma4">
                <span class="ma8">
                    <team ref="refTeam" :param="teamList" class="ma8" style="width: 100px" @onChange="onTeamChange" />
                </span>
            </div>
        </el-row>
        <el-row>
            <el-col :span="12">
                <chart-jobtype ref="chartjobtype" @onClick="onChartJobtypeClick"/>
            </el-col>
            <el-col :span="12">
                <el-table v-if="sortPrjList" :data="sortPrjList" 
                    max-height="300" style="width: 100%"
                >
                    <el-table-column fixed label="工程編號" prop="jobno" width="130" header-align="center" align="left" sortable />
                    <el-table-column fixed label="工程名稱" prop="jobname" width="240"  header-align="center" align="left" sortable>
                        <template #default="scope">
                            <el-button link type="primary" @click="handleClick(scope)">
                                {{ scope.row.jobname }}
                            </el-button>
                        </template>                        
                    </el-table-column>
                    <el-table-column label="預算種類" prop="jobtype" width="90"  header-align="center" align="center" sortable />
                    <el-table-column label="進行狀況" prop="status" width="90"  header-align="center" align="center" sortable />
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            
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
.fs20 {
    font-size: 20px;
}
.bold {
    font-weight: bold;
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
.t-area {
    font-size: 16px;
}
.tabtext {
    font-size: 18px;
    font-weight: bold;
}
</style>
