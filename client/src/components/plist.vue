<script setup>
import { ref, onMounted } from 'vue';

import JoblistSvc from '@/service/joblist.service.js';

import { useRouter } from 'vue-router';
import _ from 'lodash';
import * as util from '@/util/utils.js';

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    team: {
        type: Object,
        default: {}
    },
    group: {
        type: Object,
        default: {}
    },
    member: {
        type: Object,
        default: {}
    }    
});

//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();
var user = util.loadObj('user');
var hist = util.loadObj('hist');

const joblistSvc = new JoblistSvc();

const joblist = ref();

//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {

});

const OnClick = () => {
    //console.log(sGroup.value);
    emits('onChange', sGroup.value);
}

const getJobList = async (param) => {
    var queryobj = param;

    if (param.ofgroup1) {
        //queryobj = { ofgroup1: param.ofgroup1 == "All" ? "%" : param.ofgroup1 };
        queryobj = { ofgroup1: param.ofgroup1.length == 3 ? `${param.ofgroup1}%` : param.ofgroup1 };
        joblist.value = await joblistSvc.getByAllTeamMember(queryobj);
    }

    if (param.employeeno) {
        queryobj = { employeeno: param.employeeno };
        joblist.value = await joblistSvc.getByAllTeamMember(queryobj);
        //let l = await joblistSvc.getByLeader(queryobj);
        //let m = await joblistSvc.getByMember(queryobj);
        //joblist.value = _.unionBy(l, m, 'jobno');
        //console.log('l: ', l);
        //console.log('m: ', m);
    }

    //console.log('joblist: ', joblist.value);
};

const handleClick = (value) => {
    //console.log(value.row);
    user.sJobno = value.row.jobno;
    user.sSubjobno = value.row.subjobno;
    user.sGroup = props.group.sGroup;
    user.sTeam = props.team.sTeam;
    user.sMember = props.member.sMember;

    util.saveObj('user', user);
    //console.log('sGroup:', user.sGroup);
    //console.log(user);
    //router.push('/PM02');
    //prjoption == '' ? router.push('/PM02/PD01') : router.push(prjoption);
    _.isEmpty(hist.link) ? router.push('/PM02/PD01') : router.push(hist.link);   
};

const fmtPrg = (row, column, cellValue, index) => {
    if (typeof cellValue == 'number') {
        return parseFloat(cellValue).toFixed(2);
    } else {
        return '0.0';
    }
    //return cellValue < 60 ? '不及格' : '及格';
    //console.log(row, column, cellValue, index);
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
    getJobList
});


</script>

<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-table v-if="joblist" :data="joblist" border max-height="600" style="width: 100%" class="fs16 ma4">
                    <el-table-column fixed label="工程編號" prop="jobno" width="140" header-align="center" align="left" sortable>
                        <template #default="scope">
                            <el-button link type="primary" @click="handleClick(scope)">
                                {{ scope.row.jobno }}
                            </el-button>
                        </template>                    
                    </el-table-column>
                    <el-table-column fixed label="序號" prop="subjobno" width="60" header-align="center" align="center" sortable />
                    <el-table-column fixed label="工程名稱" prop="jobname" width="340"  header-align="center" align="left" sortable>
                    
                    </el-table-column>
                    <el-table-column label="職工編號" prop="employeeno" width="100" header-align="center" align="center" sortable />
                    <el-table-column label="姓名" prop="name" width="80" header-align="center" align="center" sortable />
                    <el-table-column label="設計型態" prop="designtype" width="60" header-align="center" align="center" sortable />
                    <el-table-column label="進行狀況" prop="status" width="60" header-align="center" align="center" sortable />
                    <el-table-column label="最近輸入" prop="yearmonth" width="100" header-align="center" align="center" sortable />
                    <el-table-column label="預定進度" prop="prg_esti" width="90" header-align="center" align="center" :formatter="fmtPrg" sortable />
                    <el-table-column label="實際進度" prop="prg_act" width="90" header-align="center" align="center" :formatter="fmtPrg" sortable />
                    <el-table-column label="預算種類" prop="jobtype" width="100" header-align="center" align="left" sortable />
                <!--
                    <el-table-column fixed="right" label="查看" width="90" header-align="center" align="center">
                        <template #default="scope">
                            <el-button link type="primary" @click="handleClick(scope)">
                                詳細資料
                            </el-button>
                        </template>
                    </el-table-column>
                -->
                </el-table>
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
</style>
