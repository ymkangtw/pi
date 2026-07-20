<script setup>
import { ref, onMounted, computed } from 'vue';
import LeaderSvc from '@/service/leader.service.js';
import MemberSvc from '@/service/member.service.js';
import EmployeeSvc from '@/service/employee.service.js';
import dayjs from 'dayjs';
//import { trimJSON, loadObj } from '@/util/utils.js';
import { ElMessage } from 'element-plus';
import { ccode } from '@/assets/colorcode.js';
import * as util from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';

//--------------------------------
// Local Variable
//--------------------------------
const userStore = useUserStore();
const sel = useSelectionStore();
var user = userStore.identity;
const date = dayjs(new Date()).format('YYYY-MM-DD');

const leaderSvc = new LeaderSvc();
const memberSvc = new MemberSvc();
const employeeSvc = new EmployeeSvc();

const l = ref();    // leader
const m = ref();    // member
const e = ref();    // employee

const newl = ref({ employeeno: '', begindate: '' });  // new leader, dialog data
const LeaderDialog = ref(false);
const addLeaderDialog = ref(false);
const sLeader = ref();

const newm = ref({ employeeno: '', begindate: '', weight: 0 });
const MemberDialog = ref(false);
const addMemberDialog = ref(false);
const sMember = ref();


const sTab = ref('leader');

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    getLeader();
    getMember();
    getEmployee();
});

const weightTotal = computed(() => {
    let wt = 0;
    for (let i in m.value) {
        wt = wt + parseInt(m.value[i].weight);
    }
    return wt;
});

const getLeader = async () => {
    await leaderSvc
        .getBy({ jobno: sel.sJobno })
        .then((data) => {
            l.value = data;
        });
};

const addLeader = async () => {
    const idx = e.value.findIndex(obj => { return obj.employeeno == newl.value.employeeno });
    let newValue = {
        jobno: sel.sJobno,
        employeeno: newl.value.employeeno,
        begindate: newl.value.begindate != "" ? newl.value.begindate : date
    };
    if ((newValue.employeeno != '') && (idx > -1)) {
        await leaderSvc
            .create(newValue)
            .then((data) => {
                data == 'created' ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });
                getLeader();
            });
    }
};

const removeLeader = async (employeeno) => {
    const idx = l.value.findIndex(obj => { return obj.employeeno == employeeno });
    let removeValue = {
        jobno: sel.sJobno,
        employeeno: employeeno
    };
    await leaderSvc
        .remove(removeValue)
        .then((data) => {
            if (data == "removed") {
                ElMessage({ message: '刪除成功', type: 'success' });
                l.value.splice(idx, 1);
            } else {
                ElMessage({ message: '刪除失敗', type: 'error' });
            }
        });
};

const updateLeader = async (employeeno) => {
    const idx = l.value.findIndex(obj => { return obj.employeeno == employeeno });
    let updateValue = {
        jobno: l.value[idx].jobno,
        employeeno: l.value[idx].employeeno,
        begindate: l.value[idx].begindate != "" ? l.value[idx].begindate : null,
        enddate: l.value[idx].enddate != "" ? l.value[idx].enddate : null,
        note: l.value[idx].note
    };
    await leaderSvc
        .update(updateValue)
        .then((data) => {
            if (data == "updated") {
                ElMessage({ message: '更新成功', type: 'success' });
            } else {
                ElMessage({ message: '更新失敗', type: 'error' });
            }
        });
};

const getMember = async () => {
    await memberSvc
        .getBy({ jobno: sel.sJobno })
        .then((data) => {
            m.value = data;
        });
};

const addMember = async () => {
    const idx = e.value.findIndex(obj => { return obj.employeeno == newm.value.employeeno });
    let lastNum;
    if (m.value.length > 0) {
        let lastm = m.value.reduce((p, c) => p.subjobno > c.subjobno ? p : c);
        lastNum = lastm.subjobno + 1;
    } else {
        lastNum = 1;
    }
    //const lastm = m.value.reduce((p, c) => p.subjobno > c.subjobno ? p : c);
    //const subjobno = lastm.subjobno;
    let newValue = {
        jobno: sel.sJobno,
        subjobno: lastNum,
        employeeno: newm.value.employeeno,
        begindate: newm.value.begindate != "" ? newm.value.begindate : date,
        weight: newm.value.weight
    };

    if ((newValue.employeeno != '') && (idx > -1)) {
        await memberSvc
            .create(newValue)
            .then((data) => {
                data == 'created' ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });
                getMember();
            });
    }

};

const removeMember = async (employeeno) => {
    const idx = m.value.findIndex(obj => { return obj.employeeno == employeeno });
    let removeValue = {
        jobno: sel.sJobno,
        employeeno: employeeno
    };
    await memberSvc
        .remove(removeValue)
        .then((data) => {
            if (data == "removed") {
                ElMessage({ message: '刪除成功', type: 'success' });
                m.value.splice(idx, 1);
            } else {
                ElMessage({ message: '刪除失敗', type: 'error' });
            }
        });
};

const updateMember = async (employeeno) => {

    const idx = m.value.findIndex(obj => { return obj.employeeno == employeeno });
    let updateValue = {
        jobno: m.value[idx].jobno,
        subjobno: m.value[idx].subjobno,
        employeeno: m.value[idx].employeeno,
        weight: m.value[idx].weight,
        begindate: m.value[idx].begindate != "" ? m.value[idx].begindate : null,
        enddate: m.value[idx].enddate != "" ? m.value[idx].enddate : null,
        note: m.value[idx].note
    };
    await memberSvc
        .update(updateValue)
        .then((data) => {
            if (data == "updated") {
                ElMessage({ message: '更新成功', type: 'success' });
            } else {
                ElMessage({ message: '更新失敗', type: 'error' });
            }            
        });
};

const getEmployee = async () => {
    await employeeSvc
        .getBy({ ofgroup1: 'Y6%' })
        .then((data) => {
            e.value = data;
        });
};

const cardColor = (enddate) => {
    let color = '';
    if (enddate == '' || enddate == null) {
        color = ccode.gray1;
    } else {
        color = ccode.gray5;
    }
    return color;
};


</script>
<template>
    <div>
        <el-row class="fend ma8">
            <el-button v-if="sTab == 'leader'" type="primary" @click="addLeaderDialog = true;">新增</el-button>
            <el-button v-if="sTab == 'member'" type="primary" @click="addMemberDialog = true;">新增</el-button>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-tabs tab-position="left" v-model="sTab" :class="['t-area']">
                    <el-tab-pane name="leader">
                        <template #label>
                            <span class="tabtext">主辦</span>
                        </template>

                        <el-row>
                            <el-col :span="24">
                                <el-row>
                                    <template v-for="item in l" :key="item.employeeno">
                                        <el-card 
                                            :class="['card', 'ma8', 'shadow']" 
                                            :body-style="{ padding: '0px' }"
                                            :style="{ 'background-color': `${cardColor(item.enddate)}` }"
                                            shadow="never" 
                                            @click="LeaderDialog = true; sLeader = item;">
                                            <div :class="['card-header', 'ma12']">
                                                <i :class="['mdi', 'mdi-18px', 'mdi-account', 'ma4']"></i>
                                                <span>{{ item.name }}</span>
                                        </div>
                                        <div :class="['card-content', 'ma12']">
                                                <div :class="['ma2']">
                                                    <span>職工編號: </span>
                                                    <span>{{ item.employeeno }}</span>
                                                </div>
                                                <div :class="['ma2']">
                                                    <span>承辦日期: </span>
                                                    <span>{{ item.begindate }}</span>
                                                </div>
                                            </div>

                                        </el-card>
                                    </template>
                                </el-row>

                            </el-col>

                        </el-row>

                    </el-tab-pane>

                    <el-tab-pane name="member">
                        <template #label>
                            <span class="tabtext">成員</span>
                        </template>
                        <el-row>
                            <el-col :span="24">
                                <el-row>
                                    <template v-for="item in m" :key="item.employeeno">
                                        <el-card 
                                            :class="['card', 'ma8', 'shadow']" 
                                            :body-style="{ padding: '0px' }"
                                            :style="{ 'background-color': `${cardColor(item.enddate)}` }" 
                                            shadow="never" 
                                            @click="MemberDialog = true; sMember = item;">
                                            <div :class="['card-header', 'ma12']">
                                                <span :class="['ma8']">{{ item.subjobno }}</span>
                                                <i :class="['mdi', 'mdi-18px', 'mdi-account', 'ma4']"></i>
                                                <span>{{ item.name }}</span>
                                            </div>
                                            <div :class="['card-content', 'ma12']">
                                                <div :class="['ma2']">
                                                    <span>職工編號: </span>
                                                    <span>{{ item.employeeno }}</span>
                                                </div>
                                                <div :class="['ma2']">
                                                    <span>承辦日期: </span>
                                                    <span>{{ item.begindate }}</span>
                                                </div>
                                                <div :class="['ma2']">
                                                    <el-progress :stroke-width="12" :percentage="item.weight" />
                                                </div>
                                            </div>

                                        </el-card>
                                    </template>
                                </el-row>
                            </el-col>

                        </el-row>
                        <el-row>
                            
                            <div>合計: {{ weightTotal }} %</div>

                        </el-row>

                    </el-tab-pane>

                </el-tabs>
            </el-col>
        </el-row>
    </div>
<!--Leader Dialog-->
    <el-dialog v-model="LeaderDialog" width="320">
        <div class="item-align ma4">
            <span class="label dlg-f ma2">職工編號</span>
            <span class="value dlg-f ma2">
                <!--
                    <el-input v-model="sLeader.employeeno" disabled />
                -->
                {{ sLeader.employeeno }}
            </span>
            <span class="ma4">
                <el-button type="danger" circle @click="removeLeader(sLeader.employeeno); LeaderDialog = false;">
                    <i :class="['mdi', 'mdi-18px', 'mdi-delete-forever']"></i>
                </el-button>
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">姓名</span>
            <span class="value dlg-f ma2">
                <!--
                    <el-input v-model="sLeader.name" disabled />
                -->
                {{ sLeader.name }}
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">開始日期</span>
            <span class="value dlg-f ma2">
                <el-date-picker v-model="sLeader.begindate" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 120px" />
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">結束日期</span>
            <span class="value dlg-f ma2">
                <el-date-picker v-model="sLeader.enddate" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 120px" />
            </span>
        </div>

        <template #footer>
            <el-button type="primary" class="ma2" @click="updateLeader(sLeader.employeeno); LeaderDialog = false;">
                更新
            </el-button>
            <el-button type="primary" class="ma2" @click="LeaderDialog = false;">
                取消
            </el-button>
        </template>

        
    </el-dialog>
<!--add Leader Dialog-->
    <el-dialog v-model="addLeaderDialog" width="320">
        <div class="item-align ma4">
            <span class="label dlg-f ma2">職工編號</span>
            <span class="value dlg-f ma2">
                <el-input v-model="newl.employeeno" />
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">開始日期</span>
            <span class="value dlg-f ma2">
                <el-date-picker v-model="newl.begindate" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 120px" />
            </span>
        </div>
        <template #footer>
            <el-button type="primary" class="ma2" @click="addLeader(); addLeaderDialog = false;">
                新增
            </el-button>
            <el-button type="primary" class="ma2" @click="addLeaderDialog = false;">
                取消
            </el-button>
        </template>

    </el-dialog>

<!--Member Dialog-->
    <el-dialog v-model="MemberDialog" width="320">
        <div class="item-align ma4">
            <span class="label dlg-f ma2">職工編號</span>
            <span class="value dlg-f ma2">
                <!--
                    <el-input v-model="sLeader.employeeno" disabled />
                -->
                {{ sMember.employeeno }}
            </span>
            <span class="ma4">
                <el-button type="danger" circle @click="removeMember(sMember.employeeno); MemberDialog = false;">
                    <i :class="['mdi', 'mdi-18px', 'mdi-delete-forever']"></i>
                </el-button>
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">姓名</span>
            <span class="value dlg-f ma2">
                <!--
                    <el-input v-model="sLeader.name" disabled />
                -->
                {{ sMember.name }}
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">開始日期</span>
            <span class="value dlg-f ma2">
                <el-date-picker v-model="sMember.begindate" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 120px" />
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">結束日期</span>
            <span class="value dlg-f ma2">
                <el-date-picker v-model="sMember.enddate" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 120px" />
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label dlg-f ma2">比重</span>
            <span class="value dlg-f ma2">
                <el-input v-model.number="sMember.weight" />
            </span>
        </div>
        <template #footer>
            <el-button type="primary" class="ma2" @click="updateMember(sMember.employeeno); MemberDialog = false;">
                更新
            </el-button>
            <el-button type="primary" class="ma2" @click="MemberDialog = false;">
                取消
            </el-button>
        </template>
    </el-dialog>
<!--add Member Dialog-->
    <el-dialog v-model="addMemberDialog" width="320">
        <div class="item-align ma4">
            <span class="label ma2">職工編號</span>
            <span class="value ma2">
                <el-input v-model="newm.employeeno" />
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label ma2">開始日期</span>
            <span class="value ma2">
                <el-date-picker v-model="newm.begindate" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 120px" />
            </span>
        </div>
        <div class="item-align ma4">
            <span class="label ma2">比重</span>
            <span class="value ma2">
                <el-input v-model.number="newm.weight" />
            </span>
        </div>

        <template #footer>
            <el-button type="primary" class="ma2" @click="addMember(); addMemberDialog = false;">
                新增
            </el-button>
            <el-button type="primary" class="ma2" @click="addMemberDialog = false;">
                取消
            </el-button>
        </template>

    </el-dialog>
</template>
<style scoped>
.tabtext {
    font-size: 18px;
    font-weight: bold;
}

.t-area {
    font-size: 16px;
    width: 900px;
}

.card {
    cursor: pointer;
    width: 180px;
    height: 110px;
}

.card-header {
    font-size: 16px;
    font-weight: bold;
}

.card-content {
    font-size: 14px;
    color: mediumblue;
}

.card-footer {
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    align-items: center;
}

.ma24 {
    margin: 24px;
}

.ma12 {
    margin: 12px;
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
