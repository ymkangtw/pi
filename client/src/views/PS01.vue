<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import team from '@/components/team.vue';
import group from '@/components/group.vue';
import member from '@/components/member.vue';

import TeamSvc from '@/service/uteam.service.js';
import GroupSvc from '@/service/ugroup.service.js';
import EmployeeSvc from '@/service/employee.service.js';
import CommonSvc from '@/service/common.service.js';
import TaskcategorySvc from '@/service/taskcategory.service.js';
import ServicevalueSvc from '@/service/servicevalue.service.js';

import ChartKpisum from '@/components/chartkpisum.vue';
import ChartMhsum from '@/components/chartmhsum.vue';
import ChartGroupkpisum from '@/components/chartgroupkpisum.vue';
import ChartGroupaccudwg from '@/components/chartgroupaccudwg.vue';
import ChartGroupaccumh from '@/components/chartgroupaccumh.vue';

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

const chartkpisum = ref();
const chartmhsum = ref();
const chartgroupkpisum = ref();
const chartgroupaccudwg = ref();
const chartgroupaccumh = ref();

//const fv = util.fv;
//const pv = util.pv;

const teamSvc = new TeamSvc();
const groupSvc = new GroupSvc();
const employeeSvc = new EmployeeSvc();
const commonSvc = new CommonSvc();
const taskcategorySvc = new TaskcategorySvc();
const servicevalueSvc = new ServicevalueSvc();

const refTeam = ref();
const refGroup = ref();
const refMember = ref();
const monthrange = ref();


const teamList = ref([]);
const groupList = ref([]);
const memberList = ref([]);
const groupkpiList = ref([]);
const selectMemberkpi = ref();

const taskcategoryList = ref([]);
const servicevalue = ref([]);

const membermi = ref([]);

const currDate = dayjs(new Date()).format('YYYY-MM-DD');
const mstart = dayjs(currDate).startOf('year').format('YYYYMM');
const mend = dayjs(currDate).endOf('year').format('YYYYMM');

const tabKPI = ref();

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    monthrange.value = [mstart, mend];
    if (!_.isEmpty(user)) {
        //console.log(user);
        let userteam = user.ofgroup1.substring(0, 3);
        refTeam.value.sTeam = userteam;
        
        await getTeamList();
        await getGroupList(userteam);
        await getMemberList(user.ofgroup1);
        await getTaskcategoryList();
        await getServicevalue();
        
        refGroup.value.sGroup = user.ofgroup1;
        await onGroupChange(user.ofgroup1);

        tabKPI.value = 'memberkpi';
    }

});

const BackTo = () => {
    router.push('/PM04');
}

const getTeamList = async (value) => {
    //console.log('getTeamList:', value);
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

const getGroupList = async (team) => {
    //console.log('getGroupList:', value);
    groupList.value = await groupSvc
        .getBy({ ofteam: team })
        .then((data) => {
            let result = [];
            for (let item of data) {
                result.push(item.groupno);
                //console.log(item);
            }
            return result;
        });
    //console.log(groupList.value);
    groupList.value.push(team);
};

const getMemberList = async (group) => {
    //console.log('getMemberList:', value);
    let group1 = group + '%'
    //console.log(group);
    
    memberList.value = await employeeSvc
        .getBy({ ofgroup1: group1 })
        .then((data) => {
            let result = [];
            for (let item of data) {
                result.push({ value: item.employeeno, label: item.name });
            }
            //result.unshift({ value: group, label: group });
            return result;
        });
    //console.log(memberList.value);


};

const getTaskcategoryList = async () => {
    taskcategoryList.value = await taskcategorySvc.getAll();
    //console.log(taskcategoryList.value);
};

const getServicevalue = async () => {
    servicevalue.value = await servicevalueSvc.getBy({ setdate: '2010-02-10' });
    await servicevalueSvc
        .getBy({ setdate: '2010-02-10' })
        .then((data) => {
            servicevalue.value = data[0];
        });
    //console.log(servicevalue.value);
};

const onTeamChange = async (team) => {
    //console.log('onTeamChange:', value);     
    await getGroupList(team);
    refGroup.value.sGroup = groupList.value[0];
    await getMemberList(refGroup.value.sGroup);
    await onGroupChange(refGroup.value.sGroup);
    //refMember.value.sMember = memberList.value[0];
};

const onGroupChange = async (group) => {
    //console.log('onGroupChange:', group);
    await getMemberList(group);
    //refMember.value.sMember = memberList.value[0];
    //await getKPI();
    //console.log(memberList.value);
    groupkpiList.value = [];
    let m;
    let regex1 = /[0-9]{6,}/g;
    let employeeno;
    let memberkpi;
    for (let item of memberList.value) {
        //console.log(item);
        if ((m = item.value.match(regex1)) !== null) {
            //employeeno = m[0];
            memberkpi = await getMemberKPI(item, monthrange.value);
            //console.log(memberkpi);
            groupkpiList.value.push(memberkpi);
        }
    }
    //console.log(groupkpiList.value);
    //onMemberClick(1);
    selectMemberkpi.value = groupkpiList.value[0];

    chartgroupkpisum.value.renderChart(groupkpiList.value);
    chartgroupaccudwg.value.renderChart(groupkpiList.value);
    chartgroupaccumh.value.renderChart(groupkpiList.value);
    onMemberClick();


};

const onMemberChange = async (member) => {
    //console.log('onMemberChange:', member);
    //await getKPI(member);
    console.log(monthrange.value);

};

const handleSelectMember = (val) => {
    //console.log(val);
    selectMemberkpi.value = val;
};



const onMemberClick = (row, column, event) => {
    //console.log(event);
    chartkpisum.value.renderChart(selectMemberkpi.value);
    chartmhsum.value.renderChart(selectMemberkpi.value);
    //console.log(selectMemberkpi.value);
};


const getMemberKPI = async (member, mrange) => {

    //let employeeno = '150433';
    //console.log(member);
    membermi.value = await commonSvc.getKPIByUser({employeeno: member.value, yearmonth1: mrange[0], yearmonth2: mrange[1]});
    //if (member.value == '165076') {
    //    console.log('KPI:', membermi.value);
    //}
    
    
    //let accu_gendwg;
    //let accu_approvaldwg;
    //let accu_dcsdwg;
    //let accu_plcdwg;
    let sVal = servicevalue.value;
    //console.log(servicevalue.value[0]);
    let memberkpi = { 
        employeeno: member.value, 
        name: member.label, 
        accu_gendwg: 0,
        accu_genmh: 0,
        accu_approvaldwg: 0,
        accu_approvalmh: 0, 
        accu_dcsdwg: 0,
        accu_dcsmh: 0,
        accu_plcdwg: 0,
        accu_plcmh: 0, 
        accu_commh: 0,
        sum_gendwg: 0,
        sum_approvaldwg: 0,
        sum_dcsdwg: 0,
        sum_plcdwg: 0,
        sum_commh: 0,
        sum_all: 0 
    };
   
    if (membermi.value.length > 0) {
        memberkpi.accu_gendwg = util.accu_gendwg_member(membermi.value);
        memberkpi.accu_genmh = util.accu_genmh_member(membermi.value);

        memberkpi.accu_approvaldwg = util.accu_approvaldwg_member(membermi.value);
        memberkpi.accu_approvalmh = util.accu_approvalmh_member(membermi.value);

        memberkpi.accu_dcsdwg = util.accu_dcsdwg_member(membermi.value);
        memberkpi.accu_dcsmh = util.accu_dcsmh_member(membermi.value);

        memberkpi.accu_plcdwg = util.accu_plcdwg_member(membermi.value);
        memberkpi.accu_plcmh = util.accu_plcmh_member(membermi.value);

        memberkpi.accu_commh = util.accu_commh_member(membermi.value);
        
        memberkpi.sum_gendwg = memberkpi.accu_gendwg * sVal.genvalue;
        memberkpi.sum_approvaldwg = memberkpi.accu_approvaldwg * sVal.approvalvalue;
        memberkpi.sum_dcsdwg = memberkpi.accu_dcsdwg * sVal.dcsvalue;
        memberkpi.sum_plcdwg = memberkpi.accu_plcdwg * sVal.plcvalue;
        memberkpi.sum_commh = memberkpi.accu_commh * sVal.comvalue / 8;
        
        memberkpi.sum_all = memberkpi.sum_gendwg + memberkpi.sum_approvaldwg + memberkpi.sum_dcsdwg + memberkpi.sum_plcdwg + memberkpi.sum_commh;
        //console.log(memberkpi);
    }

    return memberkpi;

};

const getKPISummary = (param) => {
    let { columns, data } = param
    let sums = [];
    
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '小計';
            return
        }
        if (index == 2) {
            let total_gendwg = _.reduce(data, (sum, item) => {
                return sum + util.pv(item.accu_gendwg);
            }, 0);            
            sums[index] = util.fv(total_gendwg);
        }
        if (index == 3) {
            let total_approvaldwg = _.reduce(data, (sum, item) => {
                return sum + util.pv(item.accu_approvaldwg);
            }, 0);            
            sums[index] = util.fv(total_approvaldwg);
        }
        if (index == 4) {
            let total_dcsdwg = _.reduce(data, (sum, item) => {
                return sum + util.pv(item.accu_dcsdwg);
            }, 0);            
            sums[index] = util.fv(total_dcsdwg);
        }
        if (index == 5) {
            let total_plcdwg = _.reduce(data, (sum, item) => {
                return sum + util.pv(item.accu_plcdwg);
            }, 0);            
            sums[index] = util.fv(total_plcdwg);
        }
        if (index == 6) {
            let total_commh = _.reduce(data, (sum, item) => {
                return sum + util.pv(item.accu_commh);
            }, 0);            
            sums[index] = util.fv(total_commh);
        }
        if (index == 7) {
            let total_sum_all = _.reduce(data, (sum, item) => {
                return sum + util.pv(item.sum_all);
            }, 0);            
            sums[index] = util.fv(total_sum_all);
        }                
    });

    return sums;
    
};

</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <div class="item-align ma4">
                    <span class="ma8">
                        <el-text type="danger" tag="b" size="large">KPI統計</el-text>
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
                    <team v-show="user?.titleid == 'DBDesigner'" ref="refTeam" :param="teamList" class="ma8" style="width: 100px" @onChange="onTeamChange" />
                </span>
                <span class="ma8">
                    <group ref="refGroup" :param="groupList" class="ma8" @onChange="onGroupChange" />
                </span>
            <!--
                <span class="ma8">
                    <member ref="refMember" :param="memberList" class="ma8" @onChange="onMemberChange" />
                </span>
            -->            
                <span class="ma8">
                    <el-date-picker v-model="monthrange" class="label-l ma8" type="monthrange"
                        range-separator="To" :clearable="false" format="YYYY-MM"
                        value-format="YYYYMM" :style="{ width: '240px' }" start-placeholder="開始年月"
                        end-placeholder="結束年月" @change="onGroupChange(refGroup.sGroup)">
                    </el-date-picker>

                </span>
                <span class="ma8">

                </span>
            </div>
            
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-tabs v-model="tabKPI" :class="['t-area']">
                    <el-tab-pane name="memberkpi">
                        <template #label><span class="tabtext">個人KPI</span></template>
                        <el-row>
                            <el-col :span="14">
                                <el-table v-if="groupkpiList" :data="groupkpiList"
                                    class="fs16" 
                                    show-summary
                                    highlight-current-row
                                    :summary-method="getKPISummary" 
                                    @row-click="onMemberClick"
                                    @current-change="handleSelectMember"
                                    max-height="480"
                                >
                                    <el-table-column fixed label="職工編號" prop="employeeno" width="100" header-align="center" align="center" />
                                    <el-table-column fixed label="姓名" prop="name" width="90" header-align="center" align="center" />
                                    <el-table-column fixed label="自設圖數" prop="accu_gendwg" width="90" header-align="center" align="right">
                                        <template #default="{ row }">
                                            {{ util.fv(row.accu_gendwg) }}
                                        </template>                    
                                    </el-table-column>
                                    <el-table-column fixed label="審查圖數" prop="accu_approvaldwg" width="90" header-align="center" align="right">
                                        <template #default="{ row }">
                                            {{ util.fv(row.accu_approvaldwg) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed label="DCS圖數" prop="accu_dcsdwg" width="90" header-align="center" align="right">
                                        <template #default="{ row }">
                                            {{ util.fv(row.accu_dcsdwg) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed label="PLC圖數" prop="accu_plcdwg" width="90" header-align="center" align="right">
                                        <template #default="{ row }">
                                            {{ util.fv(row.accu_plcdwg) }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed label="試車工時" prop="accu_commh" width="90" header-align="center" align="right">
                                        <template #default="{ row }">
                                            {{ util.fv(row.accu_commh) }}
                                        </template>                    
                                    </el-table-column>
                                    <el-table-column fixed label="金額" prop="sum_all" width="140" header-align="center" align="right">
                                        <template #default="{ row }">
                                            {{ util.fv(row.sum_all) }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        <!--
                            <el-col :span="5">
                                <el-row>
                                    <chart-kpisum ref="chartkpisum" />
                                </el-row>
                            </el-col>
                            <el-col :span="5">
                                <el-row>
                                    <chart-mhsum ref="chartmhsum" />
                                </el-row>
                            </el-col>
                        -->
                        
                            <el-col :span="10">
                                <el-row v-if="selectMemberkpi">
                                    <span class="ma4 fs20 bold">
                                        {{ selectMemberkpi.name }}
                                    </span>
                                </el-row>

                                <el-row>
                                    <el-col :span="12">
                                        <chart-kpisum ref="chartkpisum" />
                                    </el-col>
                                    <el-col :span="12">
                                        <chart-mhsum ref="chartmhsum" />
                                    </el-col>
                                </el-row>


                            </el-col>
                        

                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane name="kpisum">
                        <template #label><span class="tabtext">KPI分析</span></template>
                        <el-row class="ma8">
                            <chart-groupkpisum ref="chartgroupkpisum" />
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane name="kpidwg">
                        <template #label><span class="tabtext">圖數分析</span></template>
                        <el-row class="ma8">
                            <chart-groupaccudwg ref="chartgroupaccudwg" />
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane name="kpimh">
                        <template #label><span class="tabtext">工時分析</span></template>
                        <el-row class="ma8">
                            <chart-groupaccumh ref="chartgroupaccumh" />
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
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
