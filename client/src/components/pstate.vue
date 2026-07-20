<script setup>
import { ref, reactive, onMounted } from 'vue';
import draggable from 'vuedraggable';
import JoblistSvc from '@/service/joblist.service.js';
import BasicSvc from '@/service/basic.service.js';
import { trimJSON, saveObj, loadObj, fv, pv } from '@/util/utils.js';
import { useSelectionStore } from '@/stores/selection.js';
import { useRouter } from 'vue-router';
import { ccode } from '@/assets/colorcode.js';
import _ from 'lodash';
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
const sel = useSelectionStore();

const router = useRouter();
const joblistSvc = new JoblistSvc();
const basicSvc = new BasicSvc();
const joblist = reactive({ d: {} });
const tasklist = ref([
    { title: '規劃', stage: 'stage1', color: ccode.red5, task: [] },
    { title: '設計', stage: 'stage2', color: ccode.gold5, task: [] },
    { title: '施工', stage: 'stage3', color: ccode.green5, task: [] },
    { title: '試車', stage: 'stage4', color: ccode.blue5, task: [] },
    { title: '竣工', stage: 'stage5', color: ccode.purple5, task: [] }
]);
//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {

});

const getJobList = async (param) => {
    //joblist.d = trimJSON(await joblistSvc.getBy({ofgroup1: props.group.selectedGroup}));
    //joblist.d = trimJSON(await joblistSvc.getBy({ ofgroup1: props.group.selectedGroup == "All" ? "%" : props.group.selectedGroup }));
    var queryobj = param;

    if (param.ofgroup1) {

        queryobj = { ofgroup1: param.ofgroup1.length == 3 ? `${param.ofgroup1}%` : param.ofgroup1 };
        joblist.d = await joblistSvc.getBy(queryobj);
    }

    if (param.employeeno) {
        //let l = await joblistSvc.getByLeader(queryobj);
        let m = await joblistSvc.getByMember(queryobj);
        //joblist.d = _.unionBy(l, m, 'jobno');
        joblist.d = m;

    }
    
    //console.log(joblist.d);
    for (let i in tasklist.value) {
        tasklist.value[i].task = [];
    }
    for (let i in joblist.d) {

        if (joblist.d[i].status == "基本設計" || joblist.d[i].status == "理念設計" || joblist.d[i].status == "") {
            tasklist.value[0].task.push(joblist.d[i]);
        }
        if (joblist.d[i].status == "細部設計" || joblist.d[i].status == "施工設計") {
            tasklist.value[1].task.push(joblist.d[i]);
        }
        if (joblist.d[i].status == "施工") {
            tasklist.value[2].task.push(joblist.d[i]);
        }
        if (joblist.d[i].status == "試車") {
            tasklist.value[3].task.push(joblist.d[i]);
        }
        if (joblist.d[i].status == "竣工報告") {
            tasklist.value[4].task.push(joblist.d[i]);
        }
    }
};

const OnChange = (event) => {
    if (event.added) {
        let jobno = event.added.element.jobno;
        let jobname = event.added.element.jobname;
        let status = "";
        for (let i = 0; i < tasklist.value.length; i++) {
            let idx = tasklist.value[i].task.findIndex(obj => { return obj.jobno == jobno });
            if (idx > -1) {
                //console.log(`${jobno}, ${i}, ${idx}`);
                switch (i) {
                    case 0:
                        status = "基本設計";
                        break;
                    case 1:
                        status = "細部設計";
                        break;
                    case 2:
                        status = "施工";
                        break;
                    case 3:
                        status = "試車";
                        break;
                    case 4:
                        status = "竣工報告";
                        break;
                    default:
                        status = "基本設計";
                        break;
                }
            }
        }
        let updateobj = {
            jobno: jobno,
            status: status
        };
        basicSvc
            .update(updateobj)
            .then((data) => {
                if (data == "updated") {
                    let msg = `${jobno} - ${jobname} 更新成功`;
                }
            });
    }
};

const OnPrjClick = (jobno) => {
    sel.sGroup = props.group.sGroup;
    sel.sTeam = props.team.sTeam;
    sel.sMember = props.member.sMember;
    sel.sJobno = jobno;

    _.isEmpty(sel.hist.link) ? router.push('/PM02/PD01') : router.push(sel.hist.link);
    //prjoption == '' ? router.push('/PM02/PD01') : router.push(prjoption);
};

const jtColor = (jt) => {
    let color = '';
    switch (jt) {
        case '計劃型':
            color = 'red-5';
            break;
        case '非計劃型':
            color = 'green-7';
            break;
        case '營繕改良':
            color = 'blue-7';
            break;
        case '對外服務':
            color = 'gold-7';
            break;
        case '其他':
            color = 'purple-7';
            break;
        default:
            color = 'gray-7';
            break;
    }
    return color;
};

const dtColor = (dt) => {
    let color = '';
    switch (dt) {
        case '自行設計':
            color = 'geekblue-5';
            break;
        case '委外設計':
            color = 'gold-7';
            break;
        case '委外統包':
            color = 'red-5';
            break;
        default:
            color = 'gray-7';
            break;
    }
    return color;
};

const cardColor = (electricalbudget) => {
    let color = '';
    if (electricalbudget >= 50000000) {
        color = ccode.red1;
    } else if (electricalbudget >= 15000000 && electricalbudget < 50000000) {
        color = ccode.gold1;
    } else if (electricalbudget >= 8000000 && electricalbudget < 15000000) {
        color = ccode.green1;
    } else {
        color = ccode.blue1;
    }
    return color;
};

//--------------------------------
// Component Event
//--------------------------------

//--------------------------------
// Component Expose Property (Input/Output)
//--------------------------------

defineExpose({
    getJobList
});


</script>

<template>
    <div>
        <el-row justify="space-evenly">
            <el-col v-for="(column, i) in tasklist" :span="4" :key=column.stage :id=column.stage class="ma column">
                <div class="column-title col-shadow" :style="{ 'background-color': `${column.color}` }" shadow="never">
                    {{ column.title }}
                </div>
                <draggable :list="column.task" item-key="column.task.jobno" @change="OnChange" group="column.stage"
                    :animation="500" ghost-class="ghost-card">
                    <template #item="{ element }">

                        <el-card
                            :body-style="{ padding: '8px' }"
                            :class="['card', 'ma-1', 'shadow']" 
                            :style="{ 'background-color': `${cardColor(element.electricalbudget)}` }" 
                            shadow="never"
                            @click="OnPrjClick(element.jobno)"
                        >
                            <div class="card-header">
                                <span>{{ element.jobno }}</span>
                            </div>
                            <div class="card-content">
                                {{ element.jobname }}
                            </div>              
                            <div class="card-footer">
                                <span :class="[jtColor(element.jobtype)]">
                                    <template v-if="element.jobtype">
                                        <i :class="['mdi', 'mdi-18px', 'mdi-calendar-clock', jtColor(element.jobtype)]"></i>
                                        <b>{{ element.jobtype }}</b>
                                    </template>
                                </span>             
                                <span :class="[dtColor(element.designtype)]">
                                    <template v-if="element.designtype">
                                    <b>{{ `${element.designtype[0]}${element.designtype[2]}` }}</b>
                                    </template>
                                </span>           
                            </div>

                        </el-card>

                    </template>
                </draggable>
            </el-col>

        </el-row>
    </div>
</template>

<style scoped>
.column {
    min-height: 240px;
    align-items: center;
    justify-content: center;
    min-width: 15vw;
}

.column-title {
    display: flex;
    flex-wrap: wrap;
    color: white;
    font-size: 24px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    text-shadow: 0.1em 0.1em 0.2em black;
    border-radius: 5px;
    padding: 8px;
}

.card-header {
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    align-items: center;
}

.card-content {
    font-size: 16px;
    font-weight: bold;
    color: mediumblue;
    height: 64px;
}
.card-footer {
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    align-items: center;    
}
.tb {
    font-weight: bold;
}
.card {
    cursor: pointer;
    height: 120px;
}

.ma {
    margin: 8px;
}

.ma-1 {
    margin: 8px 0px;
}

.col-shadow {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
}


.ghost-card {
    opacity: 0.9;
    background: lightblue;
    border: 0px;
    box-shadow: 8px 8px 4px rgba(0, 0, 0, 0.75);
}</style>
