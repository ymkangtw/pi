<script setup>
import { ref, onMounted } from 'vue';
import BasicSvc from '@/service/basic.service.js';
import MemberSvc from '@/service/member.service.js';
import LeaderSvc from '@/service/leader.service.js';
import ContentSvc from '@/service/contents.service.js';
import EstiItemSvc from '@/service/estibyitem.service.js';
import EstiProjectSvc from '@/service/estibyproject.service.js';
import MonthbyitemSvc from '@/service/monthbyitem.service.js';
import MonthlyworkSvc from '@/service/monthbyproject.service.js';

import MptotalSvc from '@/service/monthprgbyprojecttotal.service.js';

import WeeklyworkSvc from '@/service/weeklyworkbyproject.service.js';
import OrdersSvc from '@/service/orders.service.js';
import OrderitemsSvc from '@/service/orderitems.service.js';
import DrawingnoService from '@/service/drawingno.service.js';

import JoblistSvc from '@/service/joblist.service.js';
//import { trimJSON, loadObj } from '@/util/utils.js';

import dlgdrawingno from '@/components/dlgdrawingno.vue';

import { trimJSON, loadObj, rNum, fv, pv, StrToInt } from '@/util/utils.js';
import * as dayjs from 'dayjs';
import _ from 'lodash';
import { useRouter } from 'vue-router';
import ChartBudget from '@/components/chartbudget.vue';
import { ElMessage } from 'element-plus';

//--------------------------------
// Local Variable
//--------------------------------
var user = loadObj('user');
const router = useRouter();

const basicSvc = new BasicSvc();
const memberSvc = new MemberSvc();
const leaderSvc = new LeaderSvc();
const contentSvc = new ContentSvc();
const estiitemSvc = new EstiItemSvc();
const estiprojectSvc = new EstiProjectSvc();
const monthbyitemSvc = new MonthbyitemSvc();
const monthlyworkSvc = new MonthlyworkSvc();

const mptotalSvc = new MptotalSvc();

const weeklyworkSvc = new WeeklyworkSvc();
const ordersSvc = new OrdersSvc();
const orderitemsSvc = new OrderitemsSvc();
const drawingnoSvc = new DrawingnoService();

const joblistSvc = new JoblistSvc();

const cdate = dayjs(new Date()).format('YYYY-MM-DD');

const b = ref();    // basic data

const chartBudget = ref();
const sTab = ref('type');

const dtype = ref([
    { label: '自行設計', value: '自行設計' },
    { label: '委外設計', value: '委外設計' },
    { label: '委外統包', value: '委外統包' }
]);
const jtype = ref([
    { label: '計劃型', value: '計劃型' },
    { label: '非計劃型', value: '非計劃型' },
    { label: '對外服務', value: '對外服務' },
    { label: '營繕改良', value: '營繕改良' },
    { label: '國產化', value: '國產化' },
    { label: '其他', value: '其他' },
]);
const stype = ref([
    { label: '大', value: '大' },
    { label: '中', value: '中' },
    { label: '小', value: '小' }
]);
const ttype = ref([
    { label: '原料', value: 1 },
    { label: '煉鐵', value: 2 },
    { label: '煉鋼', value: 3 },
    { label: '軋鋼', value: 4 },
    { label: '公用設施', value: 5 },
    { label: '運輸物流天車', value: 6 },
    { label: '大樓保全消防', value: 7 },
    { label: '其他', value: 8 },
]);
const status = ref([
    { label: '基本設計', value: '基本設計' },
    { label: '細部設計', value: '細部設計' },
    { label: '施工設計', value: '施工設計' },
    { label: '施工', value: '施工' },
    { label: '試車', value: '試車' },
    { label: '竣工報告', value: '竣工報告' },
    { label: '暫時中止', value: '暫時中止' },
    { label: '結案', value: '結案' },
]);

const showDialogDel = ref();            // 刪除全案資料確認Dialog
const showDialogDwg = ref();            // 圖號管理
const showDialogActFinDate = ref();     // 完工日期Dialog
const refDlgdwgno = ref();
//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    //console.log(user);
    await getBasic();
    //console.log(b.value);
    //console.log(b.value.jobno);
    chartBudget.value.renderChart(b.value);

});

const getBasic = async () => {
    await basicSvc
        .getBy({ jobno: user.sJobno })
        .then((data) => {
            b.value = trimJSON(data[0]);
        });
};

const updateBasic = async () => {
    await basicSvc
        .update(b.value)
        .then((data) => {
            data == 'updated' ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });
        });
}

const removeProject = async () => {
    let error = 0;
    let obj = { jobno: user.sJobno };
    if ( obj.jobno != '' ) {
        await basicSvc
            .remove(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await leaderSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await memberSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await contentSvc
            .remove(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await estiitemSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await estiprojectSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await monthbyitemSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await monthlyworkSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await mptotalSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await weeklyworkSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await ordersSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await orderitemsSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });
        await drawingnoSvc
            .removeAll(obj)
            .then((data) => {
                data == 'removed' ? error = error : error = error + 1;
            });   
    }
    error == 0 ? ElMessage({ message: '刪除成功', type: 'success' }) : ElMessage({ message: '刪除失敗', type: 'error' });
    router.push('/PM01');
    //router.go(0);
};

const addNewIDNo = async (idealreportno) => {
    //let data = joblistSvc.getByIdreport({});
    //console.log('cur year: ', dayjs().year() - 1911);
    //console.log(idealreportno);
    if (_.isEmpty(idealreportno)) {

        let year = dayjs().year() - 1911;
        let team = user.ofgroup1.substring(0, 3);
        let data = await joblistSvc.getByIdreport({idealreportno: `${team}-${'03'}-${year}%`});
        //console.log('last no: ', data[0].idealreportno);
        let no = 0;
        if (data.length > 0) {
            let regex = /(\d+)-CD$/;
            let match = regex.exec(data[0].idealreportno);
            if (match) {
                no = parseInt(match[1]) + 1;
            } else {
                no = 1;
            }         
        } else {
            no = 1;
        }
        //let no = 7;
        let idreportno = `${team}-${'03'}-${year}-${String(no).padStart(3, '0')}-${'CD'}`;
        b.value.idealreportno = idreportno;
        //console.log('new no: ', b.value.idealreportno);
    }
};

const addNewFNNo = async (finalreportno) => {
    if (_.isEmpty(finalreportno)) {

        let year = dayjs().year() - 1911;
        let team = user.ofgroup1.substring(0, 3);
        let data = await joblistSvc.getByIdreport({finalreportno: `${team}-${'03'}-${year}%`});
        //console.log('last no: ', data[0].idealreportno);
        let no = 0;
        if (data.length > 0) {
            let regex = /(\d+)-FN$/;
            let match = regex.exec(data[0].finalreportno);
            if (match) {
                no = parseInt(match[1]) + 1;
            } else {
                no = 1;
            }         
        } else {
            no = 1;
        }
        //let no = 7;
        let fnreportno = `${team}-${'03'}-${year}-${String(no).padStart(3, '0')}-${'FN'}`;
        b.value.finalreportno = fnreportno;
        //console.log('new no: ', b.value.idealreportno);
    }
};

const openDialogDwg = () => {    
    refDlgdwgno.value.DlgVisible = true;
};

const closeDialogDwg = () => {
    refDlgdwgno.value.DlgVisible = false;
};


const onStatusChange = (value) => {
    //console.log(value)
    if (value == '結案') {
        showDialogActFinDate.value = true;
    }
};
/*
const f = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const p = (value) => {
    return value.replace(/\$\s?|(,*)/g, '');
};
*/
</script>
<template>
    <div v-if="b">
        <el-row class="fend ma8">
            <el-button type="primary" @click="updateBasic">儲存</el-button>
        </el-row>
        <el-row>
            <el-col :span="16" :class="['left-col']">

                <el-tabs tab-position="left" v-model="sTab">
                    <el-tab-pane label="類型" name="type">
                        <template #label>
                            <span class="tabtext">類型</span>
                        </template>
                        <div class="item-align ma4">
                            <span class="label ma2">工程編號</span>
                            <span class="value ma2">
                                <el-input v-model="b.jobno" disabled />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">工程名稱</span>
                            <span class="value ma2">
                                <el-input v-model="b.jobname" style="width: 320px" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">申請單位</span>
                            <span class="value ma2">
                                <el-input v-model="b.appdept" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">設計型態</span>
                            <span class="value ma2">
                                <el-select v-model="b.designtype" class="ma2">
                                    <el-option v-for="item in dtype" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </span>
                        </div>

                        <div class="item-align ma4">
                            <span class="label ma2">進行狀況</span>
                            <span class="value ma2">
                                <el-select v-model="b.status" class="ma2" @change="onStatusChange">
                                    <el-option v-for="item in status" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </span>
                            <span v-if="b.act_fin_date" class="label-l ma2">
                                <el-text type="info">結案日期: {{ b.act_fin_date }}</el-text>
                            </span>                            
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">規模</span>
                            <span class="value ma2">
                                <el-select v-model="b.size" class="ma2">
                                    <el-option v-for="item in stype" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">技術領域</span>
                            <span class="value ma2">
                                <el-select v-model="b.techfield" class="ma2">
                                    <el-option v-for="item in ttype" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </span>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane name="budget">
                        <template #label>
                            <span class="tabtext">預算</span>
                        </template>
                        <div class="item-align ma4">
                            <span class="label ma2">預算種類</span>
                            <span class="value ma2">
                                <el-select v-model="b.jobtype" class="ma2">
                                    <el-option v-for="item in jtype" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">預算編號</span>
                            <span class="value ma2">
                                <el-input v-model="b.approvalno" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">工令編號</span>
                            <span class="value ma2">
                                <el-input v-model="b.joborderno" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">機電總預算</span>
                            <span class="value ma2">
                                <el-input v-model="b.totalbudget" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">儀電總預算</span>
                            <span class="value ma2">
                                <el-input v-model="b.electricalbudget" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">系統/施工設計</span>
                            <span class="value ma2">
                                <el-input v-model="b.y6tbudget" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">施工/施工材料</span>
                            <span class="value ma2">
                                <el-input v-model="b.y6nbudget" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane name="expense">
                        <template #label>
                            <span class="tabtext">費用</span>
                        </template>
                        <div class="item-align ma4">
                            <span class="label ma2">W61外包預算</span>
                            <span class="value ma2">
                                <el-input v-model="b.w61budget" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">W61外包費用</span>
                            <span class="value ma2">
                                <el-input v-model="b.w61expense" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">Y61外包費用</span>
                            <span class="value ma2">
                                <el-input v-model="b.budgety6turnkey" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">設備費用(Y6x)</span>
                            <span class="value ma2">
                                <el-input v-model="b.budgetequipment" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">設計費用(Y6x)</span>
                            <span class="value ma2">
                                <el-input v-model="b.budgetdesign" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">施工費用(Y6N)</span>
                            <span class="value ma2">
                                <el-input v-model="b.y6nexpense" class="right-aligned" :formatter="fv" :parser="pv" />
                            </span>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="schedule">
                        <template #label>
                            <span class="tabtext">時程</span>
                        </template>
                        <div class="item-align ma4">
                            <span class="label ma2">預算開始年度</span>
                            <span class="value ma2">
                                <el-input v-model="b.budgetyearst" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">預算結束年度</span>
                            <span class="value ma2">
                                <el-input v-model="b.budgetyearsp" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">預定開工日期</span>
                            <span class="value ma2">
                                <el-date-picker v-model="b.esti_start_date" type="date" :clearable="false"
                                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">預定完工日期</span>
                            <span class="value ma2">
                                <el-date-picker v-model="b.esti_fin_date" type="date" :clearable="false" format="YYYY-MM-DD"
                                    value-format="YYYY-MM-DD" style="width: 140px" />
                            </span>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="misc">
                        <template #label>
                            <span class="tabtext">其他</span>
                        </template>
                        <div class="item-align ma4">
                            <span class="label ma2">理念設計報告編號</span>
                            <span class="value ma2">
                                <el-input v-model="b.idealreportno" />
                            </span>
                            <span class="label ma2">
                                <el-button type="success" @click="addNewIDNo(b.idealreportno)">新增報告編號</el-button>
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">竣工報告編號</span>
                            <span class="value ma2">
                                <el-input v-model="b.finalreportno"/>
                            </span>
                            <span class="label ma2">
                                <el-button type="success" @click="addNewFNNo(b.finalreportno)">新增報告編號</el-button>
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">ISO專案編號</span>
                            <span class="value ma2">
                                <el-input v-model="b.projectno" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">業主</span>
                            <span class="value ma2">
                                <el-input v-model="b.ownerdept" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">聯絡人</span>
                            <span class="value ma2">
                                <el-input v-model="b.ownername" />
                            </span>
                        </div>
                        <div class="item-align ma4">
                            <span class="label ma2">圖號</span>
                            <span class="value ma2">
                                <el-button type="success" @click="openDialogDwg" style="width: 150px">圖號管理</el-button>
                            </span>
                            <dlgdrawingno ref="refDlgdwgno" @closeDialog="closeDialogDwg"/>
                        </div>


                        <div class="item-align ma4">
                            <span class="label ma2">
                                <el-button v-if="user.titleid == 'DBDesigner'" type="danger" @click="showDialogDel = true;">刪除全案資料</el-button>
                            </span>
                            <span class="value ma2">

                            </span>
                        </div>

                    </el-tab-pane>
                </el-tabs>

            </el-col>
            <el-col :span="8" :class="['right-col']">
                <chart-budget v-show="sTab == 'budget'" ref="chartBudget" />
            </el-col>

        </el-row>
        <el-dialog v-model="showDialogDel" width="30%">
            <span class="fs16">刪除全案工程資料?</span>
            <template #footer>
                <span>
                    <el-button @click="showDialogDel = false">取消</el-button>
                    <el-button type="primary" @click="removeProject();showDialogDel = false;">
                        確定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="showDialogActFinDate" width="30%">
            <div class="item-align ma4">
                <span class="label ma2">
                    完工日期
                </span>
                <span class="value ma2">
                    <el-date-picker v-model="b.act_fin_date" type="date" :clearable="false"
                                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                </span>
            </div>            
            <template #footer>
                <span>
                    <el-button @click="showDialogActFinDate = false">取消</el-button>
                    <el-button type="primary" @click="showDialogActFinDate = false;">
                        確定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
<style scoped>
.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
}

.left-col {
    width: 400px;
}

.right-col {
    width: 500px;
}

.tabtext {
    font-size: 18px;
    font-weight: bold;
}

.label {
    width: 140px;
}

.value {
    width: 150px;
}
.fs14 {
    font-size: 14px;
}

.fs16 {
    font-size: 16px;
}
.ma8 {
    margin: 8px;
}

.ma2 {
    margin: 2px;
}

.fend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.el-input,
.right-aligned :deep() .el-input__inner {
    text-align: end;
}
</style>
