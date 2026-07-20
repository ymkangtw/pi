<script setup>
import { ref, onMounted } from 'vue';
import BasicSvc from '@/service/basic.service.js';
import MemberSvc from '@/service/member.service.js';
import LeaderSvc from '@/service/leader.service.js';
import EmployeeSvc from '@/service/employee.service.js';
import GroupSvc from '@/service/ugroup.service.js';


import { useRouter } from 'vue-router';
import _ from 'lodash';
import * as dayjs from 'dayjs';
import * as util from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';
import { ElMessage } from 'element-plus';

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    visible : { type: Boolean, default: false }
});

//--------------------------------
// Local Variable
//--------------------------------
const userStore = useUserStore();
var user = userStore.identity;
const router = useRouter();

const DlgVisible = ref();

const basicSvc = new BasicSvc();
const memberSvc = new MemberSvc();
const leaderSvc = new LeaderSvc();
const employeeSvc = new EmployeeSvc();
const groupSvc = new GroupSvc();

const jobno = ref();

const b = ref({
    jobno: '',
    jobname: '',
    appdept: '',
    status: '基本設計',
});
const l = ref({
    jobno: '',
    employeeno: '',
    begindate: null,
    enddate: null,
});
const m = ref({
    jobno: '',
    subjobno: 1,
    employeeno: '',
    weight: 100,
    begindate: null,
    enddate: null,
});

const sTeam = ref();
//const teamAll = ref();
const team = ref();
const sMember = ref();
const memberAll = ref();
const member = ref();

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    //console.log(sGroup.value);

    if (!_.isEmpty(user)) {
        //console.log('user: ', user);
        let userteam = user.ofgroup1.substring(0, 3);
        let group = await groupSvc.getBy({ ofteam: userteam });
        //console.log('group: ', group);
        team.value = [];
        for (let item of group) {
            team.value.push({ label: item.groupno, value: item.groupno });
        }
        memberAll.value = await employeeSvc.getBy({ ofgroup1: `${userteam}%`});
    }    
/*
    memberAll.value = await employeeSvc.getBy({ ofgroup1: 'Y63%'});
    team.value = [];    
    let group;
    //group = _.unionBy(memberAll.value, 'ofgroup1').sortBy('ofgroup1');
    group = _.chain(memberAll.value).unionBy('ofgroup1').sortBy('ofgroup1');
    for (let item of group) {
        if (item.ofgroup1 !== 'Y63' && item.ofgroup1 !== 'Y63A') {
            team.value.push({ label: item.ofgroup1, value: item.ofgroup1 });
        }
    }
*/
    //console.log(memberAll.value);
    //console.log(_.isEmpty(undefined));

});

const onTeamChange = () => {
    member.value = [];
    sMember.value = '';
    let groupm = _.filter(memberAll.value, (o) => {
        return o.ofgroup1 == sTeam.value;
    });
    for (let item of groupm) {
        member.value.push({ label: item.name, value: item.employeeno });
    } 
};

const onMemberChange = () => {
    
    l.value.employeeno = sMember.value;
    createNewJobno(b.value.appdept);
    //console.log(l.value.employeeno);
};

const createNewJobno = async (value) => {
    //console.log('input: ', value);

    let existData;
    let newJobno;
    if (value.length == 3) {
        //console.log(sTeam.value);
        
        let strTeam;
        if (_.isEmpty(sTeam.value)) {
            strTeam = user.ofgroup1;
        } else {
            strTeam = sTeam.value;
        }
        let str = `${strTeam}${parseInt(dayjs().format('YYYY')) - 1911}%${value.substring(0, 3)}%`;
        //let str = `Y631111%${value.substring(0, 3)}%`;
        //let data = await basicSvc.getBy({});
        //console.log(str.toUpperCase());
        existData = await basicSvc.getBy({ jobno: str });
        //console.log(existData);
        let newNum;
        if (existData.length > 0) {
            let s = _.last(existData).jobno;
            //console.log('s: ', s);
            //console.log(s.substring(s.length - 6, s.length- 3));
            newNum = parseInt(s.substring(s.length - 6, s.length- 3)) + 1;
            //console.log('num: ', num);
            newJobno = `${strTeam}${parseInt(dayjs().format('YYYY')) - 1911}${newNum.toString().padStart(3, '0')}${value.substring(0, 3)}`;
            //console.log('newJobno: ', newJobno);
        } else {
            newJobno = `${strTeam}${parseInt(dayjs().format('YYYY')) - 1911}001${value.substring(0, 3)}`;
        }
        b.value.jobno = newJobno;
        l.value.jobno = newJobno;
        m.value.jobno = newJobno;
        
        //console.log(newJobno);
        //console.log(b.value, l.value, m.value);
        
    }
    //return newJobno;
    jobno.value = newJobno;
    //console.log(parseInt(dayjs().format('YYYY')) - 1911);
};

const addNewJob = async () => {
    await createNewJobno(b.value.appdept);
    let error = 0;
    if ( b.jobname != '' && b.appdept != '' && l.value.employeeno != '' ) {
        l.value.begindate = dayjs().format('YYYY-MM-DD');
        m.value.employeeno = l.value.employeeno;
        m.value.begindate = dayjs().format('YYYY-MM-DD');
        await basicSvc
            .create(b.value)
            .then((data) => {
                data == 'created' ? error = error : error = error + 1;
                //console.log('add basic');
            });
        await leaderSvc
            .create(l.value)
            .then((data) => {
                data == 'created' ? error = error : error = error + 1;
                console.log('add leader:', l.value);
            });
        await memberSvc
            .create(m.value)
            .then((data) => {
                data == 'created' ? error = error : error = error + 1;
                console.log('add member:', m.value);
            }); 
     
    }

    error == 0 ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });
    //router.push('/PM01');
    router.go(0);
    //basicSvc.
};

const show = () => {
    console.log('b: ', b.value);
    console.log('l: ', l.value);    
    console.log('m: ', m.value); 
  
};

const closeDialog = () => {
    //console.log(sGroup.value);
    emits('closeDialog');
}

//--------------------------------
// Component Event
//--------------------------------
const emits = defineEmits(
    ['closeDialog']
);

//--------------------------------
// Component Expose Property (Input/Output)
//--------------------------------

defineExpose({
    DlgVisible
});


</script>

<template>
    <div>
        <el-dialog v-model="DlgVisible" title="新增工程" width="80%" align-center>
            <el-row>
                <el-col :span="24">
                    <div class="item-align ma4">
                        <span class="label fs16 ma2">工程編號</span>
                        <span class="value-l fs16 ma2">
                            <el-input v-model="jobno" disabled />
                        </span>
                    </div>                    
                    <div class="item-align ma4">
                        <span class="label fs16 ma2">工程名稱</span>
                        <span class="value-l fs16 ma2">
                            <el-input v-model="b.jobname" placeholder="全案工程名稱"/>
                        </span>
                        <span class="value-l fs16 ma2">
                            <el-text type="info">例: W11 #3A堆取料機電控系統更新</el-text>
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label fs16 ma2">二級單位</span>
                        <span class="value fs16 ma2">
                            <el-input v-model="b.appdept" @input="createNewJobno" placeholder="計畫申請二級單位代號(三碼)" />
                        </span>
                    <!--
                        <span class="ma2">
                            <el-text>{{ jobno }}</el-text>
                        </span>
                    -->
                    </div>
                <!-- 
                    <div class="item-align ma4">
                        <span class="label fs16 ma2">承辦人</span>
                        <span class="value fs16 ma2">
                            <el-input v-model="l.employeeno" placeholder="承辦人職工編號" />
                        </span>
                    </div>
                -->
                    <div class="item-align ma4">
                        <span class="label fs16 ma2">承辦人</span>
                        <span class="value fs16 ma2">
                            <el-select v-model="sTeam" @change="onTeamChange" placeholder="組別">
                                <el-option v-for="item in team" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>               
                        </span>
                        <span class="value fs16 ma2">
                            <el-select v-model="sMember" @change="onMemberChange" placeholder="人員">
                                <el-option v-for="item in member" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>               
                        </span>

                    </div>


                <!--
                    <div class="item-align ma4">
                        <span class="label fs16 ma2">成員</span>
                        <span class="value fs16 ma2">
                            <el-input v-model="m.employeeno" placeholder="承辦人職工編號" />
                        </span>
                    </div>
                -->
                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
<!--
                    <el-button @click="show">
                        test
                    </el-button>
-->                    
                    <el-button @click="closeDialog">
                        取消
                    </el-button>
                    <el-button type="primary" @click="addNewJob();closeDialog();">
                        確定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.label {
    width: 120px;
}
.value {
    width: 200px;
}
.value-l {
    width: 280px;
}
.fs14 {
    font-size: 14px;
}
.fs16 {
    font-size: 16px;
}

</style>
