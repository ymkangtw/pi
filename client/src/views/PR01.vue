<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import TeamSvc from '@/service/uteam.service.js';
import GroupSvc from '@/service/ugroup.service.js';
import group from '@/components/group.vue';
import JoblistSvc from '@/service/joblist.service.js';
import WeeklyworkSvc from '@/service/weeklyworkbyproject.service.js';
import MonthlyworkSvc from '@/service/monthbyproject.service.js';
import WeeklyreportbyprjSvc from '@/service/weeklyreportbyprj.service.js';
import MonthreportbyprjSvc from '@/service/monthreportbyprj.service.js';
import UtilSvc from '@/service/util.service.js';


import { ccode } from '@/assets/colorcode.js';
import * as dayjs from 'dayjs';
import _ from 'lodash';
import * as util from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';

import { ElMessage } from 'element-plus';

//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();
const userStore = useUserStore();
var user = userStore.identity;

//個人週報
const weeklyworkSvc = new WeeklyworkSvc();
//個人月報
const monthlyworkSvc = new MonthlyworkSvc();
//三級週報
const weeklyreportbyprjSvc = new WeeklyreportbyprjSvc();
//三級月報
const monthreportbyprjSvc = new MonthreportbyprjSvc();

const utilSvc = new UtilSvc();

//const currDate = dayjs(new Date()).format('YYYY-MM-DD');

const teamSvc = new TeamSvc();
const groupSvc = new GroupSvc();
const joblistSvc = new JoblistSvc();

const groupList = ref([]);
const refGroup = ref();
const joblist = ref();

const weekrange = ref();
//const currDate = dayjs(new Date()).format('YYYY-MM-DD');
const currDate = dayjs(new Date()).format('YYYY-MM-DD');
const wstart = dayjs(currDate).startOf('week').format('YYYY-MM-DD');
const wend = dayjs(currDate).endOf('week').format('YYYY-MM-DD');
const wrptGroup = ref();

const sTab = ref('currentWeekReport');

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    //let basedate = dayjs(currDate).format('YYYY-MM-DD');
    //let wstart = dayjs(basedate).startOf('week').format('YYYY-MM-DD');
    //let wend = dayjs(basedate).endOf('week').format('YYYY-MM-DD');
    weekrange.value = [wstart, wend];

    if (!_.isEmpty(user)) {
        //console.log('user: ', user);
        let team = user.ofgroup1.substring(0, 3);
        let group = await groupSvc.getBy({ ofteam: team });
        groupList.value = group.map((item) => { return item.groupno; });
        //groupList.value.push(team);
        refGroup.value.sGroup = user.ofgroup1;
        //joblist.value = await joblistSvc.getBy({ ofgroup1: refGroup.value.sGroup });
        await getJoblist(refGroup.value.sGroup);
        await getWeeklyReportPrj(refGroup.value.sGroup);
        //console.log(joblist.value);
    }
});


const BackTo = () => {
    router.push('/PM05');
};

const getJoblist = async (value) => {
    //if value == 'Y63' then find ofgroup1 like Y63%
    let queryStr;
    value.length == 3 ? queryStr = value + '%' : queryStr = value;
    
    //let queryObj = { ofgroup1: value.length == 3 ? `${value}%` : value };
    joblist.value = await joblistSvc.getBy({ ofgroup1: queryStr });
    
    let data = await weeklyreportbyprjSvc.getBy({ ofgroup: queryStr });
    //console.log(data);
    let currWeekwork = [];
    _.map(data, (o) => {
        if (dayjs(o.inputdate).isAfter(wstart)) {
            currWeekwork.push(o);
        }
    });
    //console.log(currWeekwork);

    for (let item of joblist.value) {
        let idx = _.findIndex(currWeekwork, (o) => { return o.jobno == item.jobno; });
        if (idx >= 0) {
            item.weekwork = currWeekwork[idx].weekwork;
            item.inputdate = currWeekwork[idx].inputdate;
            item.ofgroup = currWeekwork[idx].ofgroup;
        } else {
            item.weekwork = '';
            item.inputdate = '';
            item.ofgroup = value;
        }
    }

    //console.log(joblist.value);
    //console.log(joblist.value);
};

const onGroupChange = async (value) => {
    //console.log(value);
    //let queryObj = { ofgroup1: value.length == 3 ? `${value}%` : value };
    //joblist.value = await joblistSvc.getBy(queryObj);
    await getJoblist(value);
    //console.log(joblist.value);
    //for (let it of joblist.value) {    
    //}
    await getWeeklyReportPrj(value);
};

const importWeeklyReportPrj = async () => {
    //console.log('importWeeklyReportPrj');
    let data = await weeklyreportbyprjSvc.getWeekworkByGroup({ ofgroup: refGroup.value.sGroup, inputdate1: weekrange.value[0], inputdate2: weekrange.value[1] });
    //console.log(data);
    //let content = '';
    for (let item of joblist.value) {
        let wrpt = _.filter(data, (o) => { return o.jobno == item.jobno; });

        //console.log(wrpt);
        let content = '';
        if (!_.isEmpty(wrpt)) {
            for (let it of wrpt) {
                content = content + `======== ${it.name} ========` + '\r\n' + it.content + '\r\n';
                //console.log('content:', content);
            }
        }
        item.importdata = content;
    }
    //console.log(joblist.value);
};

const exportWeeklyReportPrj = async () => {
    //console.log(refGroup.value.sGroup);
    //await utilSvc.weekreportbygroup({ group: refGroup.value.sGroup, data: joblist.value });
    
    await utilSvc
        .weekreportbygroup(joblist.value)
        .then((data) => {
            console.log('data:', data);
            if (data) {
                utilSvc.downloadFile({ file: data, group: refGroup.value.sGroup });
            }
            
        });
    

    //console.log(filename);
    //console.log(joblist.value);
    //console.log([{no: 1, name: 'a'}, {no: 2, name: 'b'}, {no: 3, name: 'c'}]);
};

const exportWeeklyReportPrjByWeek = async (ofgroup, wstart, wend) => {
    //console.log(ofgroup, wstart, wend);
    //let queryStr;
    //ofgroup.length == 3 ? queryStr = ofgroup + '%' : queryStr = ofgroup;
    let selectedWeekReport = await weeklyreportbyprjSvc.getWeekreportByGroup({ ofgroup: ofgroup, inputdate1: wstart, inputdate2: wend });
    console.log(selectedWeekReport);
    
    await utilSvc
        .weekreportbygroup(selectedWeekReport)
        .then((data) => {
            //console.log('data:', data);
            if (data) {
                utilSvc.downloadFile({ file: data, group: refGroup.value.sGroup });
            }
            
        });
    
};

const copyWeeklyReportPrj = (jobno) => {
    let idx = _.findIndex(joblist.value, (o) => { return o.jobno == jobno; });
    joblist.value[idx].weekwork = joblist.value[idx].importdata;

};

const getWeeklyReportPrj = async (value) => {
    //console.log(value);
    //wrptGroup.value = await weeklyreportbyprjSvc
    let queryStr;
    value.length == 3 ? queryStr = value + '%' : queryStr = value;
    //console.log(queryStr);
    let allWeekdata = await weeklyreportbyprjSvc
        .getBy({ ofgroup: queryStr })
        .then((data) => {
            for (let item of data) {
                let week = util.getWeekStartEnd(item.inputdate);
                //console.log(week, item.inputdate);
                item.begin = week.begin;
                item.end = week.end;
            }
            return _.reverse(data);
        });
    //console.log('allWeekdata: ', allWeekdata);
    let data1 = _.groupBy(allWeekdata, (item) => {
        return item.begin;
    });
    //console.log('data1: ', data1);

    //let work = [];
    let data2 = Object.values(data1).map((item) => ({
        begin: item[0].begin,
        end: item[0].end,
        weekwork: item
            .map((it) => `${it.jobname} 【${it.jobno}】:\r\n${it.weekwork}`)
            .join('\r\n')
    }));
    //console.log('data2: ', data2);
    wrptGroup.value = data2;

};

const saveWeeklyReportPrj = async (jobno) => {
    //console.log(jobno);
    //weeklyreportbyprjSvc.update();
    let error = 0;
    let idx = _.findIndex(joblist.value, (o) => { return o.jobno == jobno; });
    if (idx >= 0) {
        let updateObj = {
            jobno: joblist.value[idx].jobno,
            inputdate: joblist.value[idx].inputdate,
            ofgroup: joblist.value[idx].ofgroup,
            weekwork: _.replace(joblist.value[idx].weekwork, /\n/g, '\r\n')
        };
        if (updateObj.inputdate == '') {
            updateObj.inputdate = currDate;
            joblist.value[idx].inputdate = currDate;
            await weeklyreportbyprjSvc.create(updateObj).then((data) => { data == 'created' ? error = error : error = error + 1 });
        } else {
            await weeklyreportbyprjSvc.update(updateObj).then((data) => { data == 'updated' ? error = error : error = error + 1 });
        }
        error == 0 ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });
    }
};

const onTabChange = async (value) => {
    //await getWeeklyReportPrj(refGroup.value.sGroup);
    if (value == 'historyWeekReport') {
        getWeeklyReportPrj(refGroup.value.sGroup);
    }
    //console.log(value);
};

</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <div class="item-align ma4">
                    <span class="ma8">
                        <el-button type="primary" @click="BackTo">回上頁</el-button>
                    </span>
                    <span class="ma8">
                        <el-text type="danger" tag="b" size="large">三級週報</el-text>
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">

            <el-col :span="24">
                <group ref="refGroup" :param="groupList" @onChange="onGroupChange" />
            </el-col>

        </el-row>

        <el-row>
            <el-col :span="24">
                <el-tabs tab-position="top" v-model="sTab" :class="['t-area']" @tabChange="onTabChange">
                    <el-tab-pane name="currentWeekReport">
                        <template #label>
                            <span class="tabtext">本週週報</span>
                        </template>
                        <el-row>
                            <el-col :span="11">
                                <div class="item-align ma4">
                                    <!--
                                    <el-button type="primary" class="ma4" @click="saveWeeklyReportPrj">
                                        儲存
                                    </el-button>
                                -->
                                    <el-button type="success" class="ma4" @click="exportWeeklyReportPrj">
                                        <i :class="['mdi', 'mdi-18px', 'mdi-file-export']" />
                                        匯出檔案
                                    </el-button>
                                </div>
                            </el-col>
                            <el-col :span="2">
                            </el-col>
                            <el-col :span="8">
                                <div class="item-align ma4">
                                    <el-date-picker v-model="weekrange" class="label-l ma4" type="daterange"
                                        range-separator="To" :clearable="false" format="YYYY-MM-DD"
                                        value-format="YYYY-MM-DD" :style="{ width: '240px' }" start-placeholder="開始日期"
                                        end-placeholder="結束日期">
                                    </el-date-picker>

                                    <el-button type="primary" class="ma4" @click="importWeeklyReportPrj">
                                        <i :class="['mdi', 'mdi-18px', 'mdi-import']" />
                                        匯入週報
                                    </el-button>
                                </div>
                            </el-col>
                            <el-col :span="4">
                            </el-col>

                        </el-row>

                        <template v-for="(item, index) in joblist" :key="item.jobno">
                            <el-row class="ma8">
                                <el-col :span="11">
                                <!--    
                                    <el-card class="ma4">
                                        <template #header>
                                            <div class="card-header">
                                                <span>
                                                    <div>{{ item.jobname }} 【{{ item.jobno }}】</div>
                                                </span>
                                                <el-button type="primary" size="small" @click="saveWeeklyReportPrj(item.jobno)">儲存</el-button>
                                            </div>
                                        </template>
                                        <el-input v-model="item.weekwork" rows="10" type="textarea" :class="['custom-textarea']" style="{font-size: 16px;}"/>
                                    </el-card>
                                -->
                                    
                                    <div class="ma4">
                                        <div class="ma4 card-header">
                                            <span class="tabtext">{{ item.jobname }} 【{{ item.jobno }}】</span>
                                            <el-button type="primary" 
                                                @click="saveWeeklyReportPrj(item.jobno)">儲存</el-button>
                                        </div>
                                        <el-input v-model="item.weekwork" :rows=10 type="textarea"
                                            :class="['custom-textarea']" style="{font-size: 16px;}" />
                                    </div>
                                
                                </el-col>
                                <el-col :span="2" class="fcenter">
                                    <el-button type="success" @click="copyWeeklyReportPrj(item.jobno)">
                                        <i :class="['mdi', 'mdi-18px', 'mdi-arrow-left-bold']" />
                                        複製
                                    </el-button>
                                </el-col>
                                <el-col :span="11">
                                <!--    
                                    <el-card class="ma4">
                                        <template #header>
                                            <div class="card-header">
                                                <span>
                                                    <div>{{ item.jobname }} 【{{ item.jobno }}】</div>
                                                </span>
                                            </div>
                                        </template>
                                        <el-input v-model="item.importdata" rows="10" type="textarea" :class="['custom-textarea']" style="{font-size: 16px;}"/>
                                    </el-card>
                                -->
                                
                                    <div class="ma4">
                                        <div class="ma4 card-header">
                                            <span class="tabtext">{{ item.jobname }} 【{{ item.jobno }}】</span>
                                        </div>
                                        <el-input v-model="item.importdata" :rows=10 type="textarea"
                                            :class="['custom-textarea']" style="{font-size: 16px;}" />
                                    </div>
                                
                                </el-col>
                            </el-row>
                        </template>

                    </el-tab-pane>

                    <el-tab-pane name="historyWeekReport">
                        <template #label>
                            <span class="tabtext">歷史週報</span>
                        </template>
                        <el-row>
                            <el-scrollbar height="800px">

                                <el-timeline class="timeline">

                                    <template v-for="(item, index) in wrptGroup" :key="item.begin">
                                        <el-timeline-item :color="ccode.green6" size="large" placement="top">
                                            <div class="timestamp">
                                                <div class="fcenter">{{ `${item.end}` }}</div>
                                                <div class="fcenter"><i :class="['mdi', 'mdi-18px', 'mdi-dots-vertical']" />
                                                </div>
                                                <div class="fcenter">{{ `${item.begin}` }}</div>
                                            </div>
                                            <div class="item-align-t ma4">
                                                <el-input v-model="item.weekwork" :rows=14 type="textarea" :class="['report', 'custom-textarea']" style="{font-size: 14px;}" />
                                                <el-button type="success" class="ma4" @click="exportWeeklyReportPrjByWeek(refGroup.sGroup ,item.begin, item.end)">
                                                    <i :class="['mdi', 'mdi-18px', 'mdi-file-export']" />
                                                    匯出檔案
                                                </el-button>
                                            </div>

                                        </el-timeline-item>

                                    </template>
                                </el-timeline>

                            </el-scrollbar>

                        </el-row>
                    </el-tab-pane>

                </el-tabs>
            </el-col>

        </el-row>
        <!--
        <el-row>
            <el-col :span="24">

                <template v-for="(item, index) in joblist" :key="item.jobno">
                    <div>
                        {{ `${item.jobno}, ${item.jobname}` }}
                    </div>
                </template>

            </el-col>
        </el-row>
    -->
    </div>
</template>
<style scoped>
.fs14 {
    font-size: 14px;
}

.fs16 {
    font-size: 16px;
}






.item-align-t {
    display: flex;
    align-items: start;
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

.card {
    width: 700px;
    height: 300px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: blue;
    height: 32px;
}

.report {
    width: 680px;
}

.custom-textarea :deep() .el-textarea__inner {
    font-size: 15px;
}

.timeline {
    margin-left: 128px;
}

.timestamp {
    font-size: 16px;
    position: absolute;
    left: -128px;
    top: -1px;

}
</style>
