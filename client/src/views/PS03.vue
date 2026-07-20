<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import team from '@/components/team.vue';
import TeamSvc from '@/service/uteam.service.js';
import CommonSvc from '@/service/common.service.js';

import ChartOt from '@/components/chartot.vue';
import ChartOtbymonth from '@/components/chartotbymonth.vue';
import ChartOtbyperson from '@/components/chartotbyperson.vue';
import ChartMonthotbyperson from '@/components/chartmonthotbyperson.vue';

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

const chartot = ref();
const chartotbymonth = ref();
const chartotbyperson = ref();
const chartmonthotbyperson = ref();

const teamSvc = new TeamSvc();
const commonSvc = new CommonSvc();

const monthrange = ref();

const refTeam = ref();
const teamList = ref([]);
const otList = ref();

const sortTeamOtList = ref();
const sortTeamMonthOtList = ref();
const sortPersonOtlist = ref();
const sortPersonMonthOtlist = ref();
const sPerson = ref();

const refOtScroll = ref();
const refOtMonthScroll = ref();
const refPersonScroll = ref();
const refPersonMonthScroll = ref();

const otSumbyTeam = ref();

//const dept = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Y5', 'Y6', 'Y1', 'Y9', 'A', 'C', 'T', 'F'];
const currDate = dayjs(new Date()).format('YYYY-MM-DD');
const mstart = dayjs(currDate).startOf('year').format('YYYY-MM-DD');
const mend = dayjs(currDate).endOf('year').format('YYYY-MM-DD');



//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {

    monthrange.value = [mstart, mend];
    //console.log(monthrange.value);

    let userteam = user.ofgroup1.substring(0, 3);
    //refTeam.value.sTeam = userteam;
    refTeam.value.sTeam = 'Y6';
    await getTeamList();
    //await onDateChange(monthrange.value);
    await onChange(refTeam.value.sTeam, monthrange.value);
    //otList.value = await commonSvc.getPrjinprogress({ ofgroup: `${userteam}%` });
    //console.log(prjList.value);
    //chartot.value.renderChart(otList.value);
});

const BackTo = () => {
    router.push('/PM04');
}

const getTeamList = async (value) => {
    teamList.value = await teamSvc
        .getAll()
        .then((data) => {
            let result = [];
            for (let item of data) {
                result.push({ value: item.teamno, label: item.teamno, name: item.name });
                //console.log(item);
            }
            return result;
        });

    teamList.value.push({ value: 'Y6', label: 'Y6', name: '電控處' });
    //console.log(teamList.value);

};

const onTeamChange = async (team) => {
    refTeam.value.sTeam = team;   
    await onChange(refTeam.value.sTeam, monthrange.value);
};

const onDateChange = async (param) => {
    monthrange.value = [
        dayjs(param[0]).startOf('month').format('YYYY-MM-DD'),
        dayjs(param[1]).endOf('month').format('YYYY-MM-DD')
    ];
    await onChange(refTeam.value.sTeam, monthrange.value);
};

const onChange = async (team, monthrange) => {

    //console.log(team, monthrange[0], monthrange[1]);
    otList.value = await commonSvc.getOTList({
        date_st: monthrange[0],
        date_sp: monthrange[1],
    });
    let data = _.filter(otList.value, (item) => {
        //return item.teamno == team;
        return item.teamno.includes(team);
    });
    let groupedData = _.groupBy(data, 'teamno');
    let result = _.map(groupedData, function(item, teamno) {
        return {
            teamno: teamno,
            ot_total: _.sumBy(item, 'ot_total')
        };
    });
    //console.log(result);
    chartot.value.renderChart(result);
    refOtScroll.value.update();

};

const onChartOtClick = async (teamno) => {
    //console.log(teamno);
    let data = _.filter(otList.value, {teamno: teamno});
    let groupedData = _.groupBy(data, (item) => {
        return item.date_st.substring(0, 7);
    });
    let result = _.map(groupedData, (item, yearmonth) => {
        return {
            yearmonth: yearmonth,
            compensation_total: _.sumBy(item, 'compensation'),
            overtime_total: _.sumBy(item, 'overtime'),
            ot_total: _.sumBy(item, 'ot_total')
        };
    });
    result = _.sortBy(result, 'yearmonth');
    sortTeamOtList.value = result;
    //console.log(result);
    chartotbymonth.value.renderChart(teamno, result);
    refOtMonthScroll.value.update();
};

const onChartOtbymonthClick = async (data) => {
    // data = {teamno: tno.value, yearmonth: params.name}
    //console.log('onChartOtbymonthClick', data);

    let filteredData = _.filter(otList.value, (item) => {
        return item.teamno == data.teamno && item.date_st.startsWith(data.yearmonth);
    });

    let groupedData = _.groupBy(filteredData, 'employeeno');
    //console.log(groupedData);
    let result = _.map(groupedData, (item, employeeno) => {
        return {
            yearmonth: data.yearmonth,
            employeeno: employeeno,
            name: item[0].name,
            compensation_total: _.sumBy(item, 'compensation'),
            overtime_total: _.sumBy(item, 'overtime'),            
            ot_total: _.sumBy(item, 'ot_total')
        };
    });

    // 輸出結果
    //console.log(result);
    sortTeamMonthOtList.value = result;
    chartotbyperson.value.renderChart(data, result);
    refPersonScroll.value.update();
};

const onChartOtbypersonClick = async (data) => {
    // data = {teamno: 'Y63', yearmonth: '2024-07', employeeno: '185280', name: 'xxx'}
    sPerson.value = data;
    //console.log(data);
    //console.log('onChartOtbypersonClick', data);
    let filteredData = _.filter(otList.value, (item) => {
        return item.teamno == data.teamno && item.date_st.startsWith(data.yearmonth) && item.employeeno == data.employeeno;
    });
    
    sortPersonOtlist.value = filteredData;
    //console.log(sortOtlist.value);

    let personot = _.filter(otList.value, { employeeno: data.employeeno });
    let groupedData = _.groupBy(personot, (item) => {
        return item.date_st.substring(0, 7);
    });
    let result = _.map(groupedData, (item, yearmonth) => {
        return {
            yearmonth: yearmonth,
            compensation_total: _.sumBy(item, 'compensation'),
            overtime_total: _.sumBy(item, 'overtime'),
            ot_total: _.sumBy(item, 'ot_total')
        };
    });
    result = _.sortBy(result, 'yearmonth');
    //filteredData = _.filter(otList.value, (item) => {
    //    return item.teamno == data.teamno && item.employeeno == data.employeeno;
    //});
    sortPersonMonthOtlist.value = result;
    //console.log(sortPersonMonthOtlist.value);
    chartmonthotbyperson.value.renderChart(sPerson.value, result);
    refPersonMonthScroll.value.update();
};

const onChartMonthOtbypersonClick = async (data) => {

    //console.log(data);
    sPerson.value = data;
    //console.log(data);
    //console.log('onChartOtbypersonClick', data);
    let filteredData = _.filter(otList.value, (item) => {
        return item.teamno == data.teamno && item.date_st.startsWith(data.yearmonth) && item.employeeno == data.employeeno;
    });
    
    sortPersonOtlist.value = filteredData;
    //console.log(sortOtlist.value);

    let personot = _.filter(otList.value, { employeeno: data.employeeno });
    let groupedData = _.groupBy(personot, (item) => {
        return item.date_st.substring(0, 7);
    });
    let result = _.map(groupedData, (item, yearmonth) => {
        return {
            yearmonth: yearmonth,
            compensation_total: _.sumBy(item, 'compensation'),
            overtime_total: _.sumBy(item, 'overtime'),
            ot_total: _.sumBy(item, 'ot_total')
        };
    });
    result = _.sortBy(result, 'yearmonth');
    //filteredData = _.filter(otList.value, (item) => {
    //    return item.teamno == data.teamno && item.employeeno == data.employeeno;
    //});
    sortPersonMonthOtlist.value = result;
    
};


const showSummary = (param) => {
    let { columns, data } = param
    let sums = [];
    
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合計';
        }
        if (index === 5) {
            let sumc = _.reduce(data, (sum, item) => {
                return sum + item.compensation;
            }, 0);
            sums[index] = sumc;
        }
        if (index === 6) {
            let sumo = _.reduce(data, (sum, item) => {
                return sum + item.overtime;
            }, 0);
            sums[index] = sumo;
        }
        if (index === 7) {
            let sumtotal = _.reduce(data, (sum, item) => {
                return sum + item.ot_total;
            }, 0);
            sums[index] = sumtotal;
        }                        
    });

    return sums;
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
                        <el-text type="danger" tag="b" size="large">加班統計</el-text>
                    </span>
                    <span class="ma8">
                        <el-button type="primary" @click="BackTo">回上頁</el-button>
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            
                <div class="item-align ma4">
                    <span class="ma8">
                        <team ref="refTeam" :param="teamList" class="ma8" style="width: 100px" @onChange="onTeamChange" />
                    </span>

                    <span class="ma8">
                        <el-date-picker v-model="monthrange" class="label-l ma8" type="monthrange"
                            range-separator="To" :clearable="false" format="YYYY-MM"
                            value-format="YYYY-MM-DD" :style="{ width: '240px' }" start-placeholder="開始年月"
                            end-placeholder="結束年月" @change="onDateChange">
                        </el-date-picker>
                    </span>

                </div>

                

            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">          
                <el-card>
                    <el-scrollbar ref="refOtScroll" always>
                        <chart-ot ref="chartot" @onClick="onChartOtClick"/>
                    </el-scrollbar>                    
                </el-card>             
            
            </el-col>
            <el-col :span="12">
                <el-card v-show="sortTeamOtList">
                    <el-scrollbar ref="refOtMonthScroll" always>
                        <chart-otbymonth ref="chartotbymonth" @onClick="onChartOtbymonthClick"/>
                    </el-scrollbar>
                </el-card>

                

            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card v-show="sortTeamMonthOtList">
                    <el-scrollbar ref="refPersonScroll" always>
                        <chart-otbyperson ref="chartotbyperson" @onClick="onChartOtbypersonClick" />
                    </el-scrollbar>
                </el-card>

            </el-col>
            <el-col :span="12">
                <el-card v-show="sortPersonMonthOtlist">
                    <el-scrollbar ref="refPersonMonthScroll" always>
                        <chart-monthotbyperson ref="chartmonthotbyperson" @onClick="onChartMonthOtbypersonClick" />
                    </el-scrollbar>
                </el-card>
            </el-col>


        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card v-if="sortPersonOtlist">
                    <template #header>
                        <div class="card-header bold fs20">
                            <span>{{sPerson.teamno}} {{sPerson.employeeno}} {{sPerson.name}} {{ sPerson.yearmonth }} 加班明細</span>
                        </div>
                    </template>
                    <el-table :data="sortPersonOtlist" 
                        max-height="250" style="width: 100%"
                        show-summary
                        highlight-current-row
                        :summary-method="showSummary"
                    >
                        <el-table-column fixed label="單位" prop="teamno" width="60" header-align="center" align="center" />
                        <el-table-column fixed label="職工編號" prop="employeeno" width="80"  header-align="center" align="center" />
                        <el-table-column fixed label="姓名" prop="name" width="80"  header-align="center" align="center" />
                        <el-table-column label="加班日期" prop="date_st" width="120"  header-align="center" align="center" sortable />
                        <el-table-column label="事由" prop="reason" width="320"  header-align="center" align="left" sortable />
                        <el-table-column label="抵休" prop="compensation" width="80"  header-align="center" align="center" sortable />
                        <el-table-column label="加班" prop="overtime" width="80"  header-align="center" align="center" sortable />
                        <el-table-column label="合計" prop="ot_total" width="80"  header-align="center" align="center" sortable />
                    </el-table>
                </el-card>

            </el-col>


        <!--
            <div v-if="sortOtlist" class="bold fs20">
                {{sPerson.teamno}} {{sPerson.employeeno}} {{sPerson.name}} {{ sPerson.yearmonth }} 加班明細
            </div>
        -->          
        </el-row>
    </div>
</template>
<style scoped>
.el-row {
    margin-bottom: 20px;
}

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
