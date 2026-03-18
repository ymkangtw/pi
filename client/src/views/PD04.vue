<script setup>
import { ref, onMounted } from 'vue';
import MemberSvc from '@/service/member.service.js';
import EstiItemSvc from '@/service/estibyitem.service.js';
import EstiProjectSvc from '@/service/estibyproject.service.js';
import TaskCategorySvc from '@/service/taskcategory.service.js';
import TaskSvc from '@/service/task.service.js';
//import { loadObj, saveObj, isSameJobid, onlyInLeft } from '@/util/utils.js';
import * as util from '@/util/utils.js';


import * as dayjs from 'dayjs';
import _ from 'lodash';
import { ElMessage } from 'element-plus';
import { ccode } from '@/assets/colorcode.js';
import ChartdtWeight from '@/components/chartdtweight.vue';
//import 'default-passive-events';

//--------------------------------
// Local Variable
//--------------------------------
var user = util.loadObj('user');

const chartdtWeight = ref();

const memberSvc = new MemberSvc();
const estiitemSvc = new EstiItemSvc();
const taskcategorySvc = new TaskCategorySvc();
const taskSvc = new TaskSvc();
const estiprojectSvc = new EstiProjectSvc();

const dtype = ref([
    { label: '自行設計', value: '自行設計' },
    { label: '委外設計', value: '委外設計' },
    { label: '委外統包', value: '委外統包' }
]);


const sSubjobno = ref();    // selected subjobno
const sCategory = ref();    // selected category, Tabs
const sTaskid = ref();      // selected taskid

const m = ref();            // member

const tc = ref();           // all TaskCategory
const t = ref();            // all Task
//const ct = ref();           // Task by Category
const st = ref();           // selected Task

const es = ref();           // Peraonal EstiByItem, All
const ces = ref();          // Personal EstiByItem, by category

const ptc = ref();          // Personal TaskCategory Count
const tcr = ref();          // Task Category Ratio

const sei = ref();          // selected estiitem

const updateTaskDialog = ref(); // update Task Dialog
const addTaskDialog = ref();    // edit Task Dialog
const batchUpdateDialog = ref();// batch update Task Dialog
const sTab = ref('I');          // Task Category, Tabs

//batch update variable
const esti_start_date = ref();
const esti_fin_date = ref();
const design_type = ref();
const categoryName = ref();


//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    await getTaskCategory();
    await getTask();
    await getMember();
    await getDefMember();
    await OnMemberClick(sSubjobno.value);
    
});

const getMember = async () => {
    await memberSvc
        .getBy({ jobno: user.sJobno })
        .then((data) => {
            m.value = data;
        });
};

const getDefMember = () => {

    if (user.sSubjobno > 0) {
        sSubjobno.value = user.sSubjobno;
    } else {
        const sm = m.value.find(obj => { return obj.employeeno == user.employeeno });
        if (sm == undefined) {
            let fm = m.value.reduce((p, c) => p.subjobno < c.subjobno ? p : c);
            sSubjobno.value = fm.subjobno;
        } else {
            sSubjobno.value = sm.subjobno;
        }
    }

    //user.sSubjobno = sSubjobno.value;
    //saveObj('user');
    //console.log(sSubjobno.value);
};

const getTaskCategory = async () => {
    await taskcategorySvc
        .getAll()
        .then((data) => {
            tc.value = data;
        });
};

const getTask = async () => {
    await taskSvc
        .getAll()
        .then((data) => {
            t.value = data;
            st.value = t.value;
        });
};

const getSelectTask = (jobtype) => {
    let obj = _.filter(t.value, (item) => {
        return item.jobid[0] == jobtype;
    });
    ct.value = obj;
};

const OnMemberClick = async (subjobno) => {
    sSubjobno.value = subjobno;
    user.sSubjobno = subjobno;
    util.saveObj('user', user);
    await estiitemSvc
        .getBy({ jobno: user.sJobno, subjobno: sSubjobno.value })
        .then((data) => {
            es.value = data;
            //ptc.value = tc.value;
            ptc.value = _.map(tc.value, o => { return { ...o } });
            for (let taskc of ptc.value) {
                let count = 0;
                for (let item of es.value) {
                    if (item.jobid[0] === taskc.jobtype) {
                        count = count + 1;
                    }
                }
                //taskc.count = count.toString();
                taskc.count = count;
            }
            //st.value = t.value;
            st.value = _.map(t.value, o => { return { ...o } });
            for (let item of st.value) {
                let find = _.find(es.value, (it) => {
                    return item.jobid == it.jobid;
                });
                if (find) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            }
            // find first taskcategory (count > 0)
            let obj = _.find(ptc.value, (o) => { return o.count > 0; });
            if (obj) {
                if (sCategory.value == obj.jobtype) {
                    OnCategoryClick(sCategory.value);
                } else {
                    OnCategoryClick(obj.jobtype);
                }
            }

        });

    await estiprojectSvc
        .getBy({ jobno: user.sJobno, subjobno: sSubjobno.value })
        .then((data) => {
            tcr.value = data;
            //console.log('tcr: ', tcr.value);
        });
    if (tcr.value.length < 1) {
        let obj = [{
            jobno: user.sJobno,
            subjobno: sSubjobno.value,
            id_wt: 0,
            bd_wt: 0,
            dd_wt: 0,
            dcs_wt: 0,
            plc_wt: 0,
            cnt_wt: 0,
            buy_wt: 0,
            con_wt: 0,
            com_wt: 0,
            rpt_wt: 0
        }];
        tcr.value = obj;
    }
    await chartdtWeight.value.renderChart(ptc.value, tcr.value);
    //renderChart();
    //console.log(ptc.value);
};

const OnCategoryClick = async (jt) => {
    //jobtype.value = jt;
    //console.log('es: ', es.value);
    ces.value = _.filter(es.value, (item) => {
        return item.jobid[0] == jt;
    });
    sCategory.value = jt;
    //console.log(tc.value);
};

const addEstiItem = async () => {
    let selectItem = _.filter(st.value, (item) => {
        return item.checked == true;
    });

    //add jobid
    let addItems = util.onlyInLeft(selectItem, es.value, util.isSameJobid);

    for (let it of addItems) {
        let newItem = {
            jobno: user.sJobno,
            subjobno: sSubjobno.value,
            jobid: it.jobid,
        };
        await estiitemSvc.create(newItem);
    }
    //del jobid
    let delItems = util.onlyInLeft(es.value, selectItem, util.isSameJobid);
    for (let it of delItems) {
        let delItem = {
            jobno: user.sJobno,
            subjobno: sSubjobno.value,
            jobid: it.jobid,
        };
        await estiitemSvc.remove(delItem);
    }

    let obj = await estiprojectSvc.getBy({ jobno: user.sJobno, subjobno: sSubjobno.value });

    if (obj.length < 1) {
        //console.log('create tcr: ', tcr.value);
        await estiprojectSvc
            .create(tcr.value[0])
            .then((data) => {
                data == 'created' ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });               
            });
    } else {
        //console.log('update tcr: ', tcr.value);
        await estiprojectSvc
            .update(tcr.value[0])
            .then((data) => {
                data == 'updated' ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });
            });
    }
    await OnMemberClick(sSubjobno.value);
};

const deleteEstiItem = async (jobno, subjobno, jobid) => {
    let delItem = {
        jobno: jobno,
        subjobno: subjobno,
        jobid: jobid,
    };
    await estiitemSvc.remove(delItem);
    await OnMemberClick(sSubjobno.value);
};


const updateEstiItem = async () => {
/*
    await estiitemSvc
        .update(sei.value)
        .then((data) => {
            data == 'updated' ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });
        });
*/
    let error = 0;
    await estiitemSvc.update(sei.value).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    

    //console.log('es:', es.value);
    //console.log('tcr:', tcr.value);
    //console.log('ptc:', ptc.value);
    //let updateObj = tcr.value[0];
    //let updateObj = _.map(tcr.value[0], o => { return { ...o } });
    let updateObj = Object.assign({}, tcr.value[0]);
    //console.log('updateObj: ', updateObj);
    
    let summary = _.filter(ptc.value, (o) => { return o.count > 0; });
    for (let o of summary) {
        o.esti_sdate = util.esti_sdate_byjt(o.jobtype, es.value);
        o.esti_fdate = util.esti_fdate_byjt(o.jobtype, es.value);
        o.act_sdate = util.act_sdate_byjt(o.jobtype, es.value);
        o.act_fdate = util.act_fdate_byjt(o.jobtype, es.value);
        o.estidwg = util.estidwg_byjt(o.jobtype, es.value);
        o.estimh = util.estimh_byjt(o.jobtype, es.value);
        //console.log(o);
        switch (o.jobtype) {
            case 'I':
                updateObj.id_esti_mh = o.estimh;
                updateObj.id_esti_dwg = o.estidwg;
                updateObj.id_esti_start_date = o.esti_sdate;
                updateObj.id_start_date = o.act_sdate;
                updateObj.id_esti_fin_date = o.esti_fdate;
                updateObj.id_fin_date = o.act_fdate;
                break;
            case 'B': 
                updateObj.bd_esti_mh = o.estimh;
                updateObj.bd_esti_dwg = o.estidwg;
                updateObj.bd_esti_start_date = o.esti_sdate;
                updateObj.bd_start_date = o.act_sdate;
                updateObj.bd_esti_fin_date = o.esti_fdate;
                updateObj.bd_fin_date = o.act_fdate;
                break;
            case 'D': 
                updateObj.dd_esti_mh = o.estimh;
                updateObj.dd_esti_dwg = o.estidwg;
                updateObj.dd_esti_start_date = o.esti_sdate;
                updateObj.dd_start_date = o.act_sdate;
                updateObj.dd_esti_fin_date = o.esti_fdate;
                updateObj.dd_fin_date = o.act_fdate;
                break;
            case 'E': 
                updateObj.dcs_esti_mh = o.estimh;
                updateObj.dcs_esti_dwg = o.estidwg;
                updateObj.dcs_esti_start_date = o.esti_sdate;
                updateObj.dcs_start_date = o.act_sdate;
                updateObj.dcs_esti_fin_date = o.esti_fdate;
                updateObj.dcs_fin_date = o.act_fdate;           
                break;
            case 'F': 
                updateObj.plc_esti_mh = o.estimh;
                updateObj.plc_esti_dwg = o.estidwg;
                updateObj.plc_esti_start_date = o.esti_sdate;
                updateObj.plc_start_date = o.act_sdate;
                updateObj.plc_esti_fin_date = o.esti_fdate;
                updateObj.plc_fin_date = o.act_fdate;             
                break;
            case 'C': 
                updateObj.cnt_esti_mh = o.estimh;
                updateObj.cnt_esti_dwg = o.estidwg;
                updateObj.cnt_esti_start_date = o.esti_sdate;
                updateObj.cnt_start_date = o.act_sdate;
                updateObj.cnt_esti_fin_date = o.esti_fdate;
                updateObj.cnt_fin_date = o.act_fdate;
                break;
            case 'P': 
                updateObj.buy_esti_mh = o.estimh;
                updateObj.buy_esti_dwg = o.estidwg;
                updateObj.buy_esti_start_date = o.esti_sdate;
                updateObj.buy_start_date = o.act_sdate;
                updateObj.buy_esti_fin_date = o.esti_fdate;
                updateObj.buy_fin_date = o.act_fdate;
                break;
            case 'K':
                updateObj.con_esti_mh = o.estimh;
                //updateObj.con_esti_dwg = o.estidwg;
                updateObj.con_esti_start_date = o.esti_sdate;
                updateObj.con_start_date = o.act_sdate;
                updateObj.con_esti_fin_date = o.esti_fdate;
                updateObj.con_fin_date = o.act_fdate;
                break;
            case 'T': 
                updateObj.com_esti_mh = o.estimh;
                //updateObj.com_esti_dwg = o.estidwg;
                updateObj.com_esti_start_date = o.esti_sdate;
                updateObj.com_start_date = o.act_sdate;
                updateObj.com_esti_fin_date = o.esti_fdate;
                updateObj.com_fin_date = o.act_fdate;
                break;
            case 'R': 
                updateObj.rpt_esti_mh = o.estimh;
                updateObj.rpt_esti_dwg = o.estidwg;
                updateObj.rpt_esti_start_date = o.esti_sdate;
                updateObj.rpt_start_date = o.act_sdate;
                updateObj.rpt_esti_fin_date = o.esti_fdate;
                updateObj.rpt_fin_date = o.act_fdate;   
                break;
        }
    }

    //console.log(summary);
    //for (let item of es.value) {
    //    console.log(item);
    //}

    //console.log('tcr: ', tcr.value);
    //console.log('ptc: ', ptc.value);
    //console.log(updateObj);

    await estiprojectSvc.update(updateObj).then((data) => { data == 'updated' ? error = error : error = error + 1 });

    error == 0 ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });
};

const getDTColor = (designtype) => {
    let color = '';
    switch (designtype) {
        case '自行設計':
            color = ccode.gray1;
            break;
        case '委外設計':
            color = ccode.green1;
            break;
        case '委外統包':
            color = ccode.blue1;
            break;
        default:
            color = ccode.red1;
            break;
    }
    return color;
};

const InitData = () => {
    categoryName.value = tc.value.find(obj => {return obj.jobtype == sCategory.value}).category;
    let sdate = [];
    let fdate = [];
    for (let it of ces.value) {
        sdate.push(it.esti_start_date);
        fdate.push(it.esti_fin_date);
        //console.log(dayjs(it.esti_start_date).format('YYYY-MM-DD'));    
    }
    esti_start_date.value = sdate.reduce((a, b) => { return a < b ? a : b; });
    esti_fin_date.value = fdate.reduce((a, b) => { return a > b ? a : b; });
};

const batchUpdateEstiItem = async () => {
    let updateItem = {};
    let error = 0;
    for (let it of ces.value) {
        //esti_start_date.value = dayjs(esti_start_date.value).format('YYYY-MM-DD');
        //esti_fin_date.value = dayjs(esti_fin_date.value).format('YYYY-MM-DD');
        it.esti_start_date = dayjs(esti_start_date.value).format('YYYY-MM-DD');
        it.esti_fin_date = dayjs(esti_fin_date.value).format('YYYY-MM-DD');
        it.design_type = design_type.value;
        await estiitemSvc
            .update(it)
            .then((data) => {
                if (data != 'updated') {
                    error = error + 1;
                }
            });
    }
    error == 0 ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });

    //console.log(dayjs(esti_start_date.value).format('YYYY-MM-DD'));
    //console.log(dayjs(esti_fin_date.value).format('YYYY-MM-DD'));
};

const totaldtWeight = () => {
    //console.log(tcr.value[0]);
    if (tcr.value[0]) {
        let obj = tcr.value[0];
        let w = obj.id_wt + obj.bd_wt + obj.dd_wt + obj.dcs_wt + obj.plc_wt +
                obj.cnt_wt + obj.buy_wt + obj.con_wt + obj.com_wt + obj.rpt_wt;
                return w;
    } else {
        return 0;
    }
    //console.log(w);
    
};

const OnClick = () => {
    console.log(sSubjobno.value);
    //console.log(event);
};

const OnTabClick = () => {
    //console.log(sCategory.value);

};

</script>
<template>
    <div>
<!--select member-->
        <el-row>
            <el-col :span="24" class="fstart">
                <span>
                    <el-radio-group v-model="sSubjobno" class="ma8">
                        <el-radio-button v-for="item in m" :key="item.employeeno" :label="item.subjobno" :value="item.subjobno"
                            @change="OnMemberClick(item.subjobno)">
                            {{ item.name }}
                        </el-radio-button>
                    </el-radio-group>
                </span>
                <span>
                    <el-button type="primary" class="ma2" @click="addTaskDialog = true;">
                        編輯工作
                    </el-button>
                    <el-button type="primary" class="ma2" @click="InitData();batchUpdateDialog = true;">
                        批次更新
                    </el-button>

                </span>

            </el-col>

        </el-row>
<!--estiitem-->
        <el-row>
            <el-col :span="20">
                <el-tabs v-if="ptc" tab-position="left" v-model="sCategory" :class="['t-area']"
                    @click="OnCategoryClick(sCategory)">
                    <template v-for="item in ptc" :key="item.jobtype">
                        <el-tab-pane v-if="item.count > 0" :name="item.jobtype">
                            <template #label>
                                <span class="tabtext">
                                    <el-badge :value="item.count" />
                                    {{ item.category }}
                                </span>
                            </template>

                            <el-row>
                                <el-card v-for="item in ces" :key="item.jobid" 
                                    :class="['card', 'ma8', 'shadow']"
                                    :body-style="{ padding: '8px' }" shadow="never"
                                    :style="{'background-color': `${getDTColor(item.design_type)}`}"
                                    @click="sei = item; updateTaskDialog = true;">
                                    <div class="fstart ma4">
                                        <span class="card-header">{{ item.jobid }}</span>
                                        <span>
                                            <div class="fs14">預定開始 {{ item.esti_start_date }}</div>
                                            <div class="fs14">預定結束 {{ item.esti_fin_date }}</div>
                                        </span>
                                    </div>
                                    <hr />
                                    <div class="card-content ma4">{{ item.content }}</div>
                                    <div class="card-footer">
                                        <span class="fs16 ma4"><i :class="['mdi', 'mdi-18px', 'mdi-calendar-clock']"></i>圖數:
                                            {{ item.esti_dwg }}</span>
                                        <span class="fs16 ma4"><i :class="['mdi', 'mdi-18px', 'mdi-clock']"></i>工時: {{
                                            item.esti_mh }}</span>
                                    </div>
                                </el-card>

                            </el-row>

                        </el-tab-pane>
                    </template>


                </el-tabs>
            </el-col>
            <el-col :span="4">
                <chartdt-weight ref="chartdtWeight" />
                <div v-if="tcr">合計: {{ totaldtWeight() }} %</div>
            </el-col>
        </el-row>
<!--update Task Dialog-->
        <el-dialog v-model="updateTaskDialog" width="520">
            <div class="card-header fstart">
                <span>
                    <div>{{ sei.jobid }}</div>
                    <div>{{ sei.content }}</div>
                </span>
                <span>
                    <el-button type="danger" circle @click="deleteEstiItem(sei.jobno, sei.subjobno, sei.jobid);updateTaskDialog = false;">
                        <i :class="['mdi', 'mdi-18px', 'mdi-delete-forever']"></i>
                    </el-button>
                </span>
            </div>
            <hr />

            <el-row>
                <el-col :span="12">
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">預估圖數</span>
                        <span class="value dlg-f ma2">
                            <el-input v-model.number="sei.esti_dwg" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">預估工時</span>
                        <span class="value dlg-f ma2">
                            <el-input v-model.number="sei.esti_mh" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">設計型態</span>
                        <span class="value dlg-f ma2">
                            <el-select v-model="sei.design_type" class="ma2">
                                <el-option v-for="item in dtype" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">預估開始日期</span>
                        <span class="value dlg-f ma2">
                            <el-date-picker v-model="sei.esti_start_date" type="date" :clearable="false" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">預估結束日期</span>
                        <span class="value dlg-f ma2">
                            <el-date-picker v-model="sei.esti_fin_date" type="date" :clearable="false" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">圖號</span>
                        <span class="value dlg-f ma2">
                            <el-input v-model.trim="sei.dwgno" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">分類號</span>
                        <span class="value dlg-f ma2">
                            <el-input v-model.trim="sei.classcode" />
                        </span>
                    </div>                    
                </el-col>
            </el-row>
            <template #footer>
                <el-button type="primary" class="ma2" @click="updateEstiItem(); updateTaskDialog = false;">
                    更新
                </el-button>
                <el-button type="primary" class="ma2" @click="updateTaskDialog = false;">
                    取消
                </el-button>
            </template>
        </el-dialog>

<!--add Task Dialog-->
        <el-dialog v-model="addTaskDialog" width="960">
            <el-row>

                <el-tabs v-if="tc" tab-position="left" v-model="sTab" :class="['t-area']">
                <template v-for="item in tc" :key="item.jobtype">
                    <el-tab-pane :name="item.jobtype">
                        <template #label>
                            <span class="tabtext">
                                {{ item.category }} 
                            </span>
                        </template>

                        <el-row>
                            <div v-for="(it, i) in tcr" :key = it.subjobno class="item-align ma4">
                                <div class="item-align ma4">
                                    <span class="label dlg-f ma4">比重</span>
                                    <span class="value dlg-f ma4">
                                        <el-input v-if="item.jobtype == 'I'" v-model.number="it.id_wt" />
                                        <el-input v-if="item.jobtype == 'B'" v-model.number="it.bd_wt" />
                                        <el-input v-if="item.jobtype == 'D'" v-model.number="it.dd_wt" />
                                        <el-input v-if="item.jobtype == 'E'" v-model.number="it.dcs_wt" />
                                        <el-input v-if="item.jobtype == 'F'" v-model.number="it.plc_wt" />
                                        <el-input v-if="item.jobtype == 'C'" v-model.number="it.cnt_wt" />
                                        <el-input v-if="item.jobtype == 'P'" v-model.number="it.buy_wt" />
                                        <el-input v-if="item.jobtype == 'K'" v-model.number="it.con_wt" />
                                        <el-input v-if="item.jobtype == 'T'" v-model.number="it.com_wt" />
                                        <el-input v-if="item.jobtype == 'R'" v-model.number="it.rpt_wt" />
                                    </span>
                                    
                                    <span class="value dlg-f ma4">
                                        / {{ it.id_wt + it.bd_wt + it.dd_wt + it.dcs_wt + it.plc_wt + it.cnt_wt + it.buy_wt + it.con_wt + it.com_wt + it.rpt_wt }}
                                    </span>
                                </div>
                                <div class="item-align ma4">
                                    <span class="label dlg-f ma4">設計型態</span>
                                    <span class="value dlg-f ma4">
                                        <el-select v-if="item.jobtype == 'I'" v-model="it.id_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'B'" v-model="it.bd_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'D'" v-model="it.dd_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'E'" v-model="it.dcs_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'F'" v-model="it.plc_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'C'" v-model="it.cnt_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'P'" v-model="it.buy_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'K'" v-model="it.con_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'T'" v-model="it.com_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>
                                        <el-select v-if="item.jobtype == 'R'" v-model="it.rpt_type" class="ma2">
                                            <el-option v-for="itd in dtype" :key="itd.value" :label="itd.label" :value="itd.value" />
                                        </el-select>

                                    </span>
                                </div>

                            </div>
                        </el-row>
                        <el-row>
                            <el-scrollbar height="400px">
                                <el-row>
                                    <template v-for="it in st" :key="it.jobid">
                                        <el-card v-if="it.jobid[0] == item.jobtype"
                                            :class="['task-card', 'ma8', 'shadow']"
                                            :body-style="{ padding: '8px' }" shadow="never"
                                            :style="it.checked ? {'background-color': `${ccode.blue2}`} : {'background-color': `${ccode.gray1}`}"
                                            @click="it.checked = !it.checked;"
                                        >
                                            <div class="fs14">{{ it.jobid }}</div>
                                            <div class="fs14">{{ it.content }}</div>
                                        </el-card>
                                    </template>
                                </el-row>
                            </el-scrollbar>

                        </el-row>
                    </el-tab-pane>
                </template>                    
                </el-tabs>

            </el-row>
            <template #footer>
                <el-button type="primary" class="ma2" @click="addEstiItem(); addTaskDialog = false;">
                    更新
                </el-button>
                <el-button type="primary" class="ma2" @click="addTaskDialog = false;">
                    取消
                </el-button>
            </template>
        </el-dialog>
<!--Batch Update Dialog-->
        <el-dialog v-model="batchUpdateDialog" width="520">
            <div class="card-header fstart">
                <span>
                    {{ categoryName }}
                </span>
            </div>
            <hr />
            <el-row>
                <el-col :span="24">
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">預訂開始日期</span>
                        <span class="value dlg-f ma2">
                            <el-date-picker v-model="esti_start_date" type="date" :clearable="false" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">預訂結束日期</span>
                        <span class="value dlg-f ma2">
                            <el-date-picker v-model="esti_fin_date" type="date" :clearable="false" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label dlg-f ma2">設計型態</span>
                        <span class="value dlg-f ma2">
                            <el-select v-model="design_type" class="ma2">
                                <el-option v-for="item in dtype" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </span>
                    </div>
                </el-col>

            </el-row>            

            <template #footer>
                <el-button type="primary" class="ma2" @click="batchUpdateEstiItem();batchUpdateDialog = false;">
                    更新
                </el-button>
                <el-button type="primary" class="ma2" @click="batchUpdateDialog = false;">
                    取消
                </el-button>
            </template>
        </el-dialog>             

    </div>
</template>
<style scoped>
.tabtext {
    font-size: 18px;
    font-weight: bold;
}
.fs14 {
    font-size: 14px;
}
.fs16 {
    font-size: 16px;
}
.t-area {
    font-size: 16px;
}
.pa4 {
    padding: 8px;
}
.ma2 {
    margin: 2px;
}
.ma4 {
    margin: 4px;
}
.ma8 {
    margin: 8px;
}
.badge {
    margin-top: 15px;
    margin-right: 15px;
}
.card {
    cursor: pointer;
    width: 240px;
    height: 170px;
}
.card-header {
    font-size: 18px;
    font-weight: bold;
}
.card-content {
    font-size: 14px;
    color: mediumblue;
    font-weight: bold;
    height: 60px;
}
.card-footer {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
}
.task-card {
    cursor: pointer;
    width: 180px;
    height: 100px; 
}
.shadow {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
}
.shadow:hover {
    box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.5);
}
.fstart {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
.dlg-f {
    font-size: 16px;
    font-weight: bold;
}
</style>
