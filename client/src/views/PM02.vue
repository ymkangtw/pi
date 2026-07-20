<script setup>
import { ref, onMounted } from 'vue';
import BasicSvc from '@/service/basic.service.js';
import { trimJSON } from '@/util/utils.js';
import { useSelectionStore } from '@/stores/selection.js';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { ccode } from '@/assets/colorcode.js';

//--------------------------------
// Local Variable
//--------------------------------
const sel = useSelectionStore();

const router = useRouter();
const basicSvc = new BasicSvc();
const b = ref();    // basic data

const options = ref([
    { name: '基本資料', link: '/PM02/PD01', color: `${ccode.blue2}` },
    { name: '工程內容', link: '/PM02/PD02', color: `${ccode.gray1}` },
    { name: '專案成員', link: '/PM02/PD03', color: `${ccode.gray1}` },
    { name: '設計規劃', link: '/PM02/PD04', color: `${ccode.gray1}` },
    { name: '設計進度', link: '/PM02/PD05', color: `${ccode.gray1}` },
    { name: '工作報告', link: '/PM02/PD06', color: `${ccode.gray1}` },
    //{ name: '執行階段', link: '', color: `${ccode.gray1}` },
]);

const chartBudget = ref();
const sTab = ref('budget');

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    //console.log(user);
    await getBasic();
    //console.log(b.value);
    //console.log(b.value.jobno);
    //await chartBudget.value.renderChart(b.value);
    
    // 判斷 link 值而非 hist 物件本身（Pinia 初始值是 {link:'', listtype:''}，物件永遠非空）
    if (_.isEmpty(sel.hist.link)) {
        options.value[0].color = `${ccode.blue2}`;
    } else {
        for(let obj of options.value) {
            obj.link == sel.hist.link ? obj.color = `${ccode.blue2}` : obj.color = `${ccode.gray1}`;
        }
    }
    //router.push(prjoption);
    //console.log('PM2 user.sMember:', user.sMember);
});

const getBasic = async () => {

    await basicSvc
    .getBy({jobno: sel.sJobno})
    .then((data) => {
        b.value = trimJSON(data[0]);
    });
    //b.value = await basicSvc.getBy({jobno: sel.sJobno});
};

const OnOptionClick = (item) => {
    //router.push(link);
    //console.log(item);
    for(let obj of options.value) {
        obj.color = `${ccode.gray1}`;
    } 
    item.color = `${ccode.blue2}`;
    sel.hist.link = item.link;
    //saveObj('prjoption', item.link);
    //console.log(item.link);
};

//const previousPage = () => {
//    const lastPath = router.options.history.state.back;
//    return lastPath ? lastPath : '/PM01';
//};

const OnBackClick = () => {
    sel.sSubjobno = 0;
    router.push('/PM01');
    //router.back();
    //previousPage();
    //router.go(-1);
    //window.history.back();
};

const f = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const p = (value) => {
    return value.replace(/\$\s?|(,*)/g, '');
};

</script>

<template>
    <div v-if="b">
        <el-row>
            <el-col :span="24">
                <el-row>
                    <el-col :span="24" class="fstart">
                        <span class="title ma8">{{ b.jobno }} {{ b.jobname }}</span>
                        <el-button type="primary" class="ma8" @click="OnBackClick">關閉</el-button>
                    </el-col>

                </el-row>
                <el-row>
                    <template v-for="(item, index) in options">
                        <router-link :to="item.link">
                            <el-card
                                :class="['option-card', 'ma8', 'shadow']"
                                :style="{'background-color': `${item.color}`}"
                                shadow="never"
                                @click="OnOptionClick(item)"                        
                            >
                                {{ item.name }}
                            </el-card>
                        </router-link>
                    </template>
                </el-row>
                <el-row>
                    <router-view></router-view>
                </el-row>

            </el-col>
            <el-col :span="0"></el-col>
        </el-row>
    </div>
</template>
<style scoped>
.title {
    font-size: 24px;
    font-weight: bold;
    color: blue;
}
.between {
    display: flex;
    align-items: center;
    justify-content: space-between;       
}

.option-card {
    cursor: pointer;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    border-width: 1px;
    border-color: lightgray;
    width: 120px;
    height: 80px;
}
.text-l {
    display: flex;
    align-items: center;
    text-align: left;
}
.text-r {
    display: flex;
    align-items: center;
    text-align: right;
}
</style>
