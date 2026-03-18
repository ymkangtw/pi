<script setup>
import { ref, reactive, onMounted } from 'vue';
import draggable from 'vuedraggable';
import JoblistSvc from '@/service/joblist.service.js';
import BasicSvc from '@/service/basic.service.js';
import { useRouter } from 'vue-router';

import team from '@/components/team.vue';
import group from '@/components/group.vue';
import member from '@/components/member.vue';

import pstate from '@/components/pstate.vue';
import plist from '@/components/plist.vue';
import dlgaddjob from '@/components/dlgaddjob.vue';
//import cbxmember from '@/components/cbxmember.vue';
import EmployeeSvc from '@/service/employee.service.js';
import TeamSvc from '@/service/uteam.service.js';
import GroupSvc from '@/service/ugroup.service.js';

//import { trimJSON, saveObj, loadObj } from '@/util/utils.js';
import * as util from '@/util/utils.js';


//--------------------------------
// Local Variable
//--------------------------------
var user = util.loadObj('user');
var hist = util.loadObj('hist');
//console.log('load user');
const router = useRouter();

const employeeSvc = new EmployeeSvc();
const teamSvc = new TeamSvc();
const groupSvc = new GroupSvc();

//const teamList = ['Y63', 'Y62', 'Y65'];
//const groupList = ['Y631', 'Y632', 'Y633', 'Y634', 'Y635', 'Y636', 'Y637', 'Y63S', 'All', 'ME'];
const teamList = ref([]);
const groupList = ref([]);
const memberList = ref([]);

const listType = ref([
    { label: 'list', value: 'list', icon: 'mdi-view-headline' },
    { label: 'block', value: 'block', icon: 'mdi-view-grid' },
]);
const sListType = ref('block');

const refTeam = ref();
const refGroup = ref();
const refMember = ref();

const refPstate = ref();
const refPlist = ref();

const refDlgaddjob = ref();
//const dialogVisible = ref(false);

//const t = ref();
//const g = ref();

//const teamMember = ref();
const sTeam = ref();
//const sMember = ref();
//const sOption = ref();      // Team Member
//const teamMember = ref();
//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    //console.log('PM01 mounted');
    //console.log('sGroup load:', user.sGroup);
    if (!_.isEmpty(hist.listtype)) {
        sListType.value = hist.listtype;
    }

    if (!_.isEmpty(user)) {
        //console.log('user: ', user);
        let userteam = user.ofgroup1.substring(0, 3);
        //console.log(user);

        //let team = await teamSvc.getAll();
        let team = await teamSvc.getBy({visible: 1});
        //teamList.value = team.map((item) => { return item.teamno; });
        //sTeam.value = [];
        teamList.value = [];
        for (let item of team) {
            teamList.value.push({value: item.teamno, label: item.teamno, name: item.name });
        }
        //let obj = _.find(teamList.value, (o) => { return o.value == userteam; });
        //console.log('mount: ', user.sTeam);

        if (!_.isEmpty(user.sTeam)) {
            let obj = teamList.value.find((o) => { return o.value == user.sTeam; });
            sTeam.value = obj;
            userteam = user.sTeam;
            refTeam.value.sTeam = userteam;
        } else {
            sTeam.value = teamList.value.find((o) => { return o.value == userteam; });  
        }

        //console.log('sTeam.value:', sTeam.value);
        //sTeam.value = _.find(teamList.value, (o) => { return o.value == userteam; });
        //sTeam.value = teamList.value.find((o) => { return o.value == userteam; });
        //console.log('user.sTeam: ', user.sTeam);

        let group = await groupSvc.getBy({ ofteam: userteam });
        //let group = await groupSvc.getBy({ ofteam: userteam });
        groupList.value = group.map((item) => { return item.groupno; });
        groupList.value.push(userteam);
        groupList.value.push('ME');
        //console.log(groupList.value);
        //console.log('my team:', team);

        if (user.sGroup == '') {
            refGroup.value.sGroup = 'ME';
            user.sGroup = 'ME';
            refPstate.value.getJobList({ employeeno: user.employeeno });
            refPlist.value.getJobList({ employeeno: user.employeeno });
        } else {
            if (user.sGroup == 'ME') {
                refGroup.value.sGroup = 'ME';
                refPstate.value.getJobList({ employeeno: user.employeeno });
                refPlist.value.getJobList({ employeeno: user.employeeno });
            } else {
                //if (user.sMember.length > 4) {
                refGroup.value.sGroup = user.sGroup;
                const regex = /^\d{6}$/;
                if (regex.test(user.sMember)) {
                    refPstate.value.getJobList({ employeeno: user.sMember });
                    refPlist.value.getJobList({ employeeno: user.sMember });
                } else {
                    refPstate.value.getJobList({ ofgroup1: user.sGroup });
                    refPlist.value.getJobList({ ofgroup1: user.sGroup });
                }
                //refGroup.value.sGroup = user.sGroup;
                //refPstate.value.getJobList({ ofgroup1: user.sGroup });
                //refPlist.value.getJobList({ ofgroup1: user.sGroup });
                //console.log(user);
            }
        }

        //console.log('current: ', user.sMember);

        await getTeamMember(user.sGroup);

        //sOption.value = teamMember.value[0];
        //refMember.value.sMember = memberList.value[0];

        
        //console.log(teamMember.value);
        //console.log('user.sMember:', user.sMember);
        //console.log(teamMember.value.includes(user.sMember));
        //let obj = _.find(teamMember.value, (o) => { return o.value == user.sMember; });
        //console.log('find obj:', obj);
        //sOption.value = obj;
        
        if (_.find(memberList.value, (o) => { return o.value == user.sMember; })) {
            //sOption.value = user.sMember;
            refMember.value.sMember = user.sMember;
            //console.log('include:', user.sMember);
        } else {
            //sOption.value = teamMember.value[0];
            refMember.value.sMember = memberList.value[0].value;
            //console.log('first:', memberList.value[0].value);
        }
        
        

    }

});

const getTeamMember = async (group) => {
    /*
    teamMember.value = await employeeSvc
        .getBy({ ofgroup1: group })
        .then((data) => {
            let options = [];
            for (let item of data) {
                options.push({ value: item.employeeno, label: item.name });
            }
            options.unshift({ value: group, label: group });
            return options;
        });
    */
    memberList.value = await employeeSvc
        .getBy({ ofgroup1: group })
        .then((data) => {
            let options = [];
            for (let item of data) {
                options.push({ value: item.employeeno, label: item.name });
            }
            options.unshift({ value: group, label: group });
            return options;
        });

    //console.log(teamMember.value);
};

const onTeamChange = async (value) => {
    //console.log(value);
    let group = await groupSvc.getBy({ ofteam: value });
    groupList.value = group.map((item) => { return item.groupno; });
    groupList.value.push(value);
    groupList.value.push('ME');
    refGroup.value.sGroup = value;
    //hist.steam = sTeam.value;
    //util.saveObj('hist', hist);
    
    user.sTeam = value;
    util.saveObj('user', user);  
    
    //console.log(sTeam.value[0].value);
    onGroupChange(value)
};

const onGroupChange = async (value) => {
    //console.log('emit: ', value);

    if (value == 'ME') {
        refPstate.value.getJobList({ employeeno: user.employeeno });
        refPlist.value.getJobList({ employeeno: user.employeeno });

        //teamMember.value = [{ value: user.employeeno, label: user.name }];
        memberList.value = [{ value: user.employeeno, label: user.name }];
        //sOption.value = user.employeeno;
        refMember.value.sMember = user.employeeno;
        //teamMember.value = [];
    } else {
        refPstate.value.getJobList({ ofgroup1: value });
        refPlist.value.getJobList({ ofgroup1: value });

        await getTeamMember(value);
        //sOption.value = teamMember.value[0];
        refMember.value.sMember = value;
    }

    user.sGroup = value; 
    util.saveObj('user', user);
    //console.log('sGroup change:', user.sGroup);
};

const onMemberChange = async (value) => {
    //console.log(value);
    const regex = /^\d{6}$/;

    if (regex.test(value)) {
        refPstate.value.getJobList({ employeeno: value });
        refPlist.value.getJobList({ employeeno: value });
    } else {
        refPstate.value.getJobList({ ofgroup1: value });
        refPlist.value.getJobList({ ofgroup1: value });
    }
    //refMember.value.sMember = value;
    user.sMember = value;
    util.saveObj('user', user);
    //console.log('member change, user.sMember: ', user.sMember);
    //console.log('member change, sOption.value: ', sOption.value);
};

const onListTypeChange = () => {
    hist.listtype = sListType.value;
    util.saveObj('hist', hist);
    //console.log('hist:', hist);
};

const showDialog = () => {
    
    refDlgaddjob.value.DlgVisible = true;
    //dialogVisible.value = true;
    //console.log('open dialog: ', dialogVisible.value);
};

const closeDialog = () => {
    refDlgaddjob.value.DlgVisible = false;
    //router.push('/PM01');
    //router.go(0);
    //dialogVisible.value = false;
    //console.log('close dialog: ', dialogVisible.value);
};

const onRadioClick = () => {
    console.log(sListType.value);
};

const BackTo = () => {
    router.push('/project');
};
/*
const onMemberChange = (value) => {
    //console.log(value);
    console.log('sGroup:', refGroup.value.sGroup);
};
*/
</script>

<template>
    <div>
        <el-row :gutter="10" class="item-align">

            <el-col :span="2">
<!--
                <el-select v-if="user.titleid == 'DBDesigner'" v-model="sTeam" @change="onTeamChange" placeholder="Select">
                    <el-option v-for="item in teamList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
-->
                <team v-if="user.titleid == 'DBDesigner'" ref="refTeam" :param="teamList" @onChange="onTeamChange" />

                <el-text v-if="user.titleid != 'DBDesigner' && sTeam">
                    {{ sTeam.name }}
                </el-text>

            </el-col>            

            <el-col :span="12">
                <group ref="refGroup" :param="groupList" @onChange="onGroupChange" />
            </el-col>


            <el-col :span="3">
                <!--
                <cbxmember @onChange="onMemberChange" :param="refGroup"/>
                -->
            <!--
                <el-select v-model="sOption" @change="onMemberChange" placeholder="Select">
                    <el-option v-for="item in teamMember" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            -->
                <member ref="refMember" :param="memberList" @onChange="onMemberChange" />

            </el-col>
            <el-col :span="3">
                <el-radio-group v-model="sListType" @change="onListTypeChange">
                    <el-radio-button v-for="(item, index) in listType" :key="item.value" :label="item.label" :value = "item.value">
                        <i :class="['mdi', 'mdi-16px', `${item.icon}`]"></i>
                    </el-radio-button>
                </el-radio-group>                
            </el-col>

            <el-col :span="2">
                <el-button type="primary" @click="showDialog();">新增工程</el-button>
<!--
                <dlgaddjob ref="refDlgaddjob" :visible="dialogVisible" @closeDialog="closeDialog" />
-->
                <dlgaddjob ref="refDlgaddjob" @closeDialog="closeDialog"/>

            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="BackTo">回上頁</el-button>
            </el-col>            
        </el-row>

        <el-row>
            <el-col :span="24">
                <pstate v-show="sListType == 'block'" ref="refPstate" :team="refTeam" :group="refGroup" :member="refMember" />
                <plist v-show="sListType == 'list'" ref="refPlist" :team="refTeam" :group="refGroup" :member="refMember" />

            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.ma2 {
    margin: 2px;
}
.ma8 {
    margin: 8px;
}
.item-align {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
