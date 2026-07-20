
<script setup>
import { ref, reactive, onMounted, watchPostEffect } from 'vue';
import MemberSvc from '@/service/member.service.js';
import WeeklyworkSvc from '@/service/weeklyworkbyproject.service.js';
import MonthlyworkSvc from '@/service/monthbyproject.service.js';
//import WeeklyworkSvc from '@/service/weeklyworkbygroup.service.js';
import WeeklyreportbyprjSvc from '@/service/weeklyreportbyprj.service.js';
import MonthreportbyprjSvc from '@/service/monthreportbyprj.service.js';

import LeaderSvc from '@/service/leader.service.js';

import * as dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import * as util from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';

import { ElMessage } from 'element-plus';
import { ccode } from '@/assets/colorcode.js';
import _ from 'lodash';

dayjs.extend(isBetween, isSameOrBefore, isSameOrAfter);

//--------------------------------
// Local Variable
//--------------------------------
const userStore = useUserStore();
const sel = useSelectionStore();
var user = userStore.identity;
const currDate = dayjs(new Date()).format('YYYY-MM-DD');

// Project Member
const sSubjobno = ref();    // selected subjobno
const m = ref();            // member
const memberSvc = new MemberSvc();

// Year Month
const YM = ref();           // all yearmonth
const YMOptions = ref();    // yearmonth value of Select Component
const sYM = ref();          // selected yearmonth
const currYM = ref();       // current yearmonth

// Report Type
const sReport = ref();
//const sReportAll = ref();

const reportType = ref([
    { label: '週報', value: 'weeklyreport' },
    { label: '月報', value: 'monthlyreport' }
]);

// Weekly Report by member
const weeklyworkSvc = new WeeklyworkSvc();
const wrpt = ref();

// Monthly Report by member
const monthlyworkSvc = new MonthlyworkSvc();
const mrpt = ref();

// Weekly Report by project
const weeklyreportbyprjSvc = new WeeklyreportbyprjSvc();
const wrptprj = ref();

// Monthly Report by project
const monthreportbyprjSvc = new MonthreportbyprjSvc();
const mrptprj = ref();

// get team leader
const leaderSvc = new LeaderSvc();
const l = ref();

//weekreport start/end date
//const weekstart = ref();
//const weekend = ref();
const weekrange = ref();
const monthrange = ref();

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    //console.log(user);
    await getMember();
    await getDefMember();
    //console.log(m.value);
    //console.log(sSubjobno.value);
    sReport.value = "weeklyreport";
    //sReportAll.value = "weeklyreportall";
    //let basedate = dayjs(currDate).subtract(8, 'day').format('YYYY-MM-DD');
    let basedate = dayjs(currDate).format('YYYY-MM-DD');
    let wstart = dayjs(basedate).startOf('week').format('YYYY-MM-DD');
    let wend = dayjs(basedate).endOf('week').format('YYYY-MM-DD');
    weekrange.value = [wstart, wend];
    let mstart = dayjs(basedate).subtract(8, 'day').startOf('month').format('YYYY-MM-DD');
    let mend = dayjs(basedate).subtract(8, 'day').endOf('month').format('YYYY-MM-DD');
    monthrange.value = [mstart, mend];
    //console.log(basedate);

    OnMemberClick(sel.sJobno, sSubjobno.value);
    //let weekData = genWeeklyDate('2019-11-13', '2023-06-14');
    //console.log(weekData);
});
/*
const genWeeklyDate = (startDate, endDate) => {
    const weeklyDateObjects = [];
    let currentWeekStart = dayjs(startDate).startOf('week');
    let currentWeekEnd = dayjs(startDate).endOf('week');

    while (currentWeekStart.isSameOrBefore(endDate)) {
        weeklyDateObjects.push({
            begin: currentWeekStart.format('YYYY-MM-DD'),
            end: currentWeekEnd.format('YYYY-MM-DD')
        });

        currentWeekStart = currentWeekStart.add(1, 'week');
        currentWeekEnd = currentWeekEnd.add(1, 'week');
    }

    return weeklyDateObjects;
};
*/
const getWeekStartEnd = (currentDate) => {
    //const weeklyDateObjects = [];
    let currentWeekStart = dayjs(currentDate).startOf('week').format('YYYY-MM-DD');
    let currentWeekEnd = dayjs(currentDate).endOf('week').format('YYYY-MM-DD');

    //weeklyDateObjects.push({
    //    begin: currentWeekStart.format('YYYY-MM-DD'),
    //    end: currentWeekEnd.format('YYYY-MM-DD')
    //});

    //return weeklyDateObjects;
    //console.log(currentWeekStart, currentWeekEnd);
    return {begin: currentWeekStart, end: currentWeekEnd};

}


const getMember = async () => {
    /*
    await memberSvc
        .getBy({ jobno: sel.sJobno })
        .then((data) => {
            m.value = data;
        });
    */
    m.value = await memberSvc.getBy({ jobno: sel.sJobno });
};

const getDefMember = () => {
    if (sel.sSubjobno > 0) {
        sSubjobno.value = sel.sSubjobno;
    } else {
        const sm = m.value.find(obj => { return obj.employeeno == user.employeeno });
        if (sm == undefined) {
            let fm = m.value.reduce((p, c) => p.subjobno < c.subjobno ? p : c);
            sSubjobno.value = fm.subjobno;
        } else {
            sSubjobno.value = sm.subjobno;
        }
    }
};

const OnMemberClick = async (jobno, subjobno) => {
    // get weekly report
    //console.log(getWeekStartEnd('2023-08-03'));
    sSubjobno.value = subjobno;
    sel.sSubjobno = subjobno;

    l.value = await leaderSvc.getBy({ jobno: jobno });
    let ofgroup = '';
    for (let item of l.value) {
        if (_.isEmpty(item.enddate)) {
            ofgroup = item.ofgroup1;
            break;
        }
    }
    //console.log('ofgroup:', ofgroup);

    if (typeof subjobno == 'number') {
        wrpt.value = await weeklyworkSvc
            .getBy({ jobno: jobno, subjobno: subjobno })
            .then((data) => {
                for (let item of data) {
                    let week = getWeekStartEnd(item.inputdate);
                    //console.log(week, item.inputdate);
                    item.begin = week.begin;
                    item.end = week.end;
                }
                return _.reverse(data);
            })
            .then((data) => {
                let latest = _.head(data);
                let currWeek = getWeekStartEnd(currDate);
                if (latest) {
                    
                    if (dayjs(currWeek.begin).isAfter(dayjs(latest.begin))) {
                        data.unshift({
                            jobno: jobno,
                            subjobno: subjobno,
                            //inputdate: currDate,
                            inputdate: '',
                            content: '',
                            begin: currWeek.begin,
                            end: currWeek.end
                        });
                    }
                }
                if (!latest) {
                    data.unshift({
                        jobno: jobno,
                        subjobno: subjobno,
                        //inputdate: currDate,
                        inputdate: '',
                        content: '',
                        begin: currWeek.begin,
                        end: currWeek.end
                    });
                }
                return data;
            });
        // get monthly report
        mrpt.value = await monthlyworkSvc
            .getBy({ jobno: jobno, subjobno: subjobno })
            .then((data) => {
                return _.reverse(data);
            })
            .then((data) => {
                let latest = _.head(data);
                let curYearmonth = dayjs(currDate).subtract(8, 'day').format('YYYYMM');
                if (latest) {
                    //console.log(latest.yearmonth);
                    
                    if (latest.yearmonth < curYearmonth) {
                        data.unshift({
                            jobno: jobno,
                            subjobno: subjobno,
                            yearmonth: curYearmonth,
                            monthwork: '',
                            newrecord: true
                        });
                    }
                    //console.log(dayjs(currDate).format('YYYYMM'));
                }
                if (!latest) {

                    data.unshift({
                        jobno: jobno,
                        subjobno: subjobno,
                        yearmonth: curYearmonth,
                        monthwork: '',
                        newrecord: true
                    });
                    
                }
                //console.log(data);
                return data;
            });


    } else {
        // save weekwork by project
        //console.log('all week/month work');
        //wrptprj.value = await weeklyreportbyprjSvc.getBy({ jobno: jobno });
        //console.log(wrptprj.value);
        wrptprj.value = await weeklyreportbyprjSvc
            .getBy({ jobno: jobno })
            .then((data) => {
                for (let item of data) {
                    let week = getWeekStartEnd(item.inputdate);
                    //console.log(week, item.inputdate);
                    item.begin = week.begin;
                    item.end = week.end;
                }
                return _.reverse(data);
            })
            .then((data) => {
                let latest = _.head(data);
                let currWeek = getWeekStartEnd(currDate);
                if (latest) {
                    
                    if (dayjs(currWeek.begin).isAfter(dayjs(latest.begin))) {
                        data.unshift({
                            jobno: jobno,
                            //subjobno: subjobno,
                            //inputdate: currDate,
                            inputdate: '',
                            ofgroup: ofgroup,
                            weekwork: '',
                            begin: currWeek.begin,
                            end: currWeek.end
                        });
                    }
                }
                if (!latest) {
                    data.unshift({
                        jobno: jobno,
                        //subjobno: subjobno,
                        //inputdate: currDate,
                        inputdate: '',
                        ofgroup: ofgroup,
                        weekwork: '',
                        begin: currWeek.begin,
                        end: currWeek.end
                    });
                }
                return data;
            });

        // get monthly report by project
        mrptprj.value = await monthreportbyprjSvc
            .getBy({ jobno: jobno })
            .then((data) => {
                return _.reverse(data);
            })
            .then((data) => {
                let latest = _.head(data);
                let curYearmonth = dayjs(currDate).subtract(8, 'day').format('YYYYMM');
                if (latest) {
                    //console.log(latest.yearmonth);
                    
                    if (latest.yearmonth < curYearmonth) {
                        data.unshift({
                            jobno: jobno,
                            yearmonth: curYearmonth,
                            ofgroup: ofgroup,
                            monthwork: '',
                            newrecord: true
                        });
                    }
                    //console.log(dayjs(currDate).format('YYYYMM'));
                }
                if (!latest) {

                    data.unshift({
                        jobno: jobno,
                        yearmonth: curYearmonth,
                        ofgroup: ofgroup,
                        monthwork: '',
                        newrecord: true
                    });
                    
                }
                //console.log(data);
                return data;
            });
            

    }
    
};

const saveWeekReport = async () => {
    //weeklyworkSvc.create();
    let error = 0;
    let curWeekReport = {
        jobno: wrpt.value[0].jobno,
        subjobno: wrpt.value[0].subjobno,
        inputdate: wrpt.value[0].inputdate,
        content: _.replace(wrpt.value[0].content, /\n/g, '\r\n')
    };

    if (curWeekReport.inputdate == '') {
        curWeekReport.inputdate = currDate;
        wrpt.value[0].inputdate = currDate;
        await weeklyworkSvc.create(curWeekReport).then((data) => { data == 'created' ? error = error : error = error + 1 });
    } else {
        await weeklyworkSvc.update(curWeekReport).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    }
    error == 0 ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });
    //console.log('save week report', wrpt.value[0]);
};

const saveMonthReport = async () => {
    let error = 0;
    let curMonthReport = Object.assign({}, mrpt.value[0]);
    curMonthReport.jobno = mrpt.value[0].jobno;
    curMonthReport.subjobno = mrpt.value[0].subjobno;
    curMonthReport.yearmonth = mrpt.value[0].yearmonth;
    //curMonthReport.monthwork = mrpt.value[0].monthwork;
    curMonthReport.monthwork = _.replace(mrpt.value[0].monthwork, /\n/g, '\r\n');


    //await monthlyworkSvc.update(curMonthReport).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    
    if (mrpt.value[0].newrecord) {
        await monthlyworkSvc.create(curMonthReport).then((data) => { data == 'created' ? error = error : error = error + 1 });
    } else {
        await monthlyworkSvc.update(curMonthReport).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    }

    error == 0 ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });

};

const saveWeekReportPrj = async () => {
    let error = 0;
    let curWeekReport = {
        jobno: wrptprj.value[0].jobno,
        inputdate: wrptprj.value[0].inputdate,
        ofgroup: wrptprj.value[0].ofgroup,
        weekwork: wrptprj.value[0].weekwork
    };

    if (curWeekReport.inputdate == '') {
        curWeekReport.inputdate = currDate;
        wrptprj.value[0].inputdate = currDate;
        await weeklyreportbyprjSvc.create(curWeekReport).then((data) => { data == 'created' ? error = error : error = error + 1 });
    } else {
        await weeklyreportbyprjSvc.update(curWeekReport).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    }
    error == 0 ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });
    //console.log('save week report', wrpt.value[0]);
}; 

const saveMonthReportPrj = async () => {
    let error = 0;
    let curMonthReport = {
        jobno: mrptprj.value[0].jobno,
        yearmonth: mrptprj.value[0].yearmonth,
        ofgroup: mrptprj.value[0].ofgroup,
        monthwork: mrptprj.value[0].monthwork
    };
    if (mrptprj.value[0].newrecord) {
        await monthreportbyprjSvc.create(curMonthReport).then((data) => { data == 'created' ? error = error : error = error + 1 });
    } else {
        await monthreportbyprjSvc.update(curMonthReport).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    }
    error == 0 ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });

};

//
const importWeeklyReport = () => {
    let basedate = dayjs(currDate).subtract(8, 'day').format('YYYY-MM-DD');
    let mstart = dayjs(basedate).startOf('month').format('YYYY-MM-DD');
    let mend = dayjs(basedate).endOf('month').format('YYYY-MM-DD');
    //console.log(start, end);
    //let testday = '2023-08-08';
    //console.log(dayjs(testday).subtract(8, 'day').format('YYYY-MM-DD'));
    //console.log(dayjs(testday).isSameOrAfter(mstart) && dayjs(testday).isSameOrBefore(mend));

    let curMonthReport = '';
    for (let item of wrpt.value) {
        if (dayjs(item.inputdate).isSameOrAfter(mstart) && dayjs(item.inputdate).isSameOrBefore(mend)) {
            curMonthReport = curMonthReport + item.content + '\r\n';
        }
    }
    mrpt.value[0].monthwork = curMonthReport;

};

const importWeeklyReportPrj = async () => {
    //let basedate = dayjs(currDate).subtract(8, 'day').format('YYYY-MM-DD');
    //let mstart = dayjs(basedate).startOf('month').format('YYYY-MM-DD');
    //let mend = dayjs(basedate).endOf('month').format('YYYY-MM-DD');
    //console.log(weekrange.value);
    let data = await weeklyreportbyprjSvc.getWeekworkByPrj({ jobno: sel.sJobno, inputdate1: weekrange.value[0], inputdate2: weekrange.value[1] });
    //console.log('data: ', data);

    let content = '';
    for (let item of data) {
        content = content + `======== ${item.name} ========` + '\r\n' + item.content + '\r\n'; 
    }
    wrptprj.value[0].weekwork = content;

    //console.log('sel.sJobno: ', sel.sJobno);
    //console.log('inputdate1: ', weekrange.value[0]);
    //console.log('inputdate2: ', weekrange.value[1]);

/*
    let curWeekReportPrj = '';
    for (let item of wrpt.value) {
        if (dayjs(item.inputdate).isSameOrAfter(mstart) && dayjs(item.inputdate).isSameOrBefore(mend)) {
            curMonthReport = curMonthReport + item.content + '\r\n';
        }
    }
    wrptprj.value[0].weekwork = curMonthReport;
*/
};

const importMonthReportPrj = async () => {
    let data = await monthreportbyprjSvc.getMonthworkByPrj({ jobno: sel.sJobno, inputdate1: monthrange.value[0], inputdate2: monthrange.value[1] });
    //console.log('data: ', data);

    let content = '';
    for (let item of data) {
        content = content + `######## ${item.inputdate} ########` + '\r\n' + item.weekwork + '\r\n'; 
    }
    mrptprj.value[0].monthwork = content;    
}

</script>
<template>
    <div>
        <el-row>
            <el-col :span="24" class="fstart">
                <span>
                    <el-radio-group v-model="sSubjobno" class="ma8">
                        <el-radio-button v-for="item in m" :key="item.employeeno" :label="item.subjobno" :value="item.subjobno"
                            @change="OnMemberClick(sel.sJobno, item.subjobno)">
                            {{ item.name }}
                        </el-radio-button>

                        <el-radio-button key="all" label="all" value="all" @change="OnMemberClick(sel.sJobno, 'all')">
                            全案     
                        </el-radio-button>
                       
                    </el-radio-group>
                </span>
                <span>
<!--
                    <el-select v-model="sYM" class="value ma2" @change="OnYMChange">
                        <el-option v-for="item in YMOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
-->

                </span>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">

                <template v-if="sSubjobno != 'all'">
                   
                    <el-tabs tab-position="left" v-model="sReport" :class="['t-area']">
                    
                        <el-tab-pane name="weeklyreport">
                            <template #label>
                                <span class="tabtext">
                                    週報
                                </span>
                            </template>
                            <el-row class="fend ma4">
                                <el-button type="primary" class="ma2" @click="saveWeekReport">
                                    儲存
                                </el-button>                            
                            </el-row>

                            <el-row>
                                <el-scrollbar height="800px">
                                    <el-timeline class="timeline">
                                        <template v-for="(item, index) in wrpt" :key="item.inputdate" >
                                            <el-timeline-item :timestamp="`填寫日期:${item.inputdate}`" :color="ccode.blue6" size="large" placement="top">
                                                <div class="timestamp">
                                                    <div class="fcenter">{{ `${item.end}` }}</div>
                                                    <div class="fcenter"><i :class="['mdi', 'mdi-18px', 'mdi-dots-vertical']" /></div>
                                                    <div class="fcenter">{{ `${item.begin}` }}</div>
                                                </div>
                                                <el-input v-model="item.content" :rows=8 type="textarea" :class="['report', 'custom-textarea']" style="font-size: 18px;"/>
                                            </el-timeline-item>
                                        </template>
                                    </el-timeline>
                                </el-scrollbar>

                            </el-row>
                        </el-tab-pane>

                        <el-tab-pane name="monthlyreport">
                        <template #label>
                            <span class="tabtext">
                                月報
                            </span>
                        </template>
                        <el-row class="fend ma4">
                            <el-button type="primary" class="ma2" @click="saveMonthReport">
                                儲存
                            </el-button>
                            <el-button type="primary" class="ma2" @click="importWeeklyReport">
                                匯入週報
                            </el-button>
                        </el-row>
                        <el-row>
                            <el-scrollbar height="800px">
                                <el-timeline class="timeline">
                                    <template v-for="(item, index) in mrpt" :key="item.yearmonth" >
                                        <el-timeline-item :color="ccode.green6" size="large" placement="top">                                            
                                            <div class="timestamp">
                                                <div class="fcenter">{{ `${item.yearmonth.substring(0,4)} 年 ${item.yearmonth.substring(item.yearmonth.length - 2)} 月` }}</div>
                                            </div>
                                            <el-input v-model="item.monthwork" :rows=10 type="textarea" :class="['report', 'custom-textarea']" style="font-size: 18px;"/>
                                        </el-timeline-item>
                                    </template>
                                </el-timeline>
                            </el-scrollbar>
                        </el-row>
                        </el-tab-pane>

                    </el-tabs>                

                </template>
               

                <template v-if="sSubjobno == 'all'">
                    <el-tabs tab-position="left" v-model="sReport" :class="['t-area']">
                                
                        <el-tab-pane name="weeklyreport">
                            <template #label>
                                <span class="tabtext">
                                    週報
                                </span>
                            </template>
                            <el-row class="fend ma4">

                                <div class="item-align ma4">
                                    <el-button type="primary" class="ma2" @click="saveWeekReportPrj">
                                        儲存
                                    </el-button>

                                    <el-date-picker 
                                        v-model="weekrange" class="label-l ma2" type="daterange" range-separator="To"
                                        :clearable=" false " format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 240px"
                                        start-placeholder="開始日期" end-placeholder="結束日期"
                                    >
                                    </el-date-picker>

                                    <el-button type="primary" class="ma2" @click="importWeeklyReportPrj">
                                        匯入組員週報
                                    </el-button>                                    
                                </div>
                            </el-row>

                            <el-row>
                                <el-scrollbar height="800px">
                                    <el-timeline class="timeline">
                                        <template v-for="(item, index) in wrptprj" :key="item.inputdate" >
                                            <el-timeline-item :timestamp="`填寫日期:${item.inputdate}`" :color="ccode.blue6" size="large" placement="top">
                                                <div class="timestamp">
                                                    <div class="fcenter">{{ `${item.end}` }}</div>
                                                    <div class="fcenter"><i :class="['mdi', 'mdi-18px', 'mdi-dots-vertical']" /></div>
                                                    <div class="fcenter">{{ `${item.begin}` }}</div>
                                                </div>
                                            <!--
                                                <div class="item-align ma4">
                                                    <span class="value ma2">
                                                        
                                                    </span>
                                                </div>
                                            -->
                                                <el-input v-model="item.weekwork" :rows=12 type="textarea" :class="['report', 'custom-textarea']" style="font-size: 18px;"/>

                                            </el-timeline-item>
                                        </template>
                                    </el-timeline>
                                </el-scrollbar>

                            </el-row>
                        </el-tab-pane>

                        <el-tab-pane name="monthlyreport">
                            <template #label>
                                <span class="tabtext">
                                    月報
                                </span>
                            </template>
                            <el-row class="fend ma4">
                                <div class="item-align ma4">
                                    <el-button type="primary" class="ma2" @click="saveMonthReportPrj">
                                        儲存
                                    </el-button>

                                    <el-date-picker 
                                        v-model="monthrange" class="label-l ma2" type="daterange" range-separator="To"
                                        :clearable=" false " format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 240px"
                                        start-placeholder="開始日期" end-placeholder="結束日期"
                                    >
                                    </el-date-picker>

                                    <el-button type="primary" class="ma2" @click="importMonthReportPrj">
                                        匯入當月週報
                                    </el-button>
                                </div>
                            </el-row>
                            <el-row>
                                <el-scrollbar height="800px">
                                    <el-timeline class="timeline">
                                        <template v-for="(item, index) in mrptprj" :key="item.yearmonth" >
                                            <el-timeline-item :color="ccode.green6" size="large" placement="top">
                                                <div class="timestamp">
                                                    <div class="fcenter">{{ `${item.yearmonth.substring(0,4)} 年 ${item.yearmonth.substring(item.yearmonth.length - 2)} 月` }}</div>
                                                </div>
                                                <el-input v-model="item.monthwork" :rows=14 type="textarea" :class="['report', 'custom-textarea']" style="font-size: 18px;"/>
                                            </el-timeline-item>
                                        </template>
                                    </el-timeline>
                                </el-scrollbar>
                            </el-row>
                        </el-tab-pane>

                    </el-tabs>                
                </template>


            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
.ma2 {
    margin: 2px;
}
.ma4 {
    margin: 4px;
}
.ma8 {
    margin: 8px;
}
.ma16 {
    margin: 16px;
}

.fstart {
    display: flex;
    align-items: center;
    justify-content: start;
}
.fcenter {
    display: flex;
    align-items: center;
    justify-content: center;
}
.fend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
}
.label {
    width: 100px;
}

.value {
    width: 120px;
}
.label-l {
    width: 240px;
}
.tabtext {
    font-size: 18px;
    font-weight: bold;
}

.t-area {
    font-size: 16px;
}

.card {
    cursor: pointer;
    width: 700px;
    height: 160px;
}
.report {
    width: 680px;
}
.custom-textarea :deep() .el-textarea__inner {
    font-size: 16px;
}
.t-area-width {
    width: 200px;
    
}
.custom-radio :deep() .el-radio__input {
    font-size: 16px;
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
