<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OrderitemsSvc from '@/service/orderitems.service.js';
import _ from 'lodash';
import * as util from '@/util/utils.js';

//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();
var user = util.loadObj('user');
//var prjoption = util.loadObj('prjoption');

const orderitemsSvc = new OrderitemsSvc();
const orderitems = ref();
const queryCount = ref();

const queryStr = ref();

//--------------------------------
// Local Function
//--------------------------------
const BackTo = () => {
    router.push('/PM03');
};

const onQuery = async () => {
    //console.log(queryStr.value);
    orderitems.value = await orderitemsSvc.getBy({ name: `%${queryStr.value}%` });
    queryCount.value = orderitems.value.length;
    //console.log(orderitems.value);
};

const handleClick = (value) => {
    //console.log(value.row.jobno);
    user.sJobno = value.row.jobno;
    util.saveObj('user', user);
    //console.log(user);
    //router.push('/PM02');
    //prjoption == '' ? router.push('/PM02/PD01') : router.push(prjoption);
    //_.isEmpty(prjoption) ? router.push('/PM02/PD01') : router.push(prjoption);
    router.push('/PM02/PD05');
};

const handleMaterialcode = (value) => {
    //console.log(value.row.materialcode);
    //const routeData = router.resolve({name: 'routeName', query: {data: "someData"}});
    //window.open(routeData.href, '_blank');
    //const routeData = router.resolve({query: {}});
    window.open(`http://mvatcp.csc.com.tw:7080/CICS/MI0M/MIOU0M/${user.employeeno}/${value.row.materialcode}`, '_blank');
};

const onKeydown = () => {
    //console.log('press enter');
};

</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <div class="item-align ma4">
                    <span class="ma8">
                        <el-text type="primary" tag="b" size="large">請購案查詢</el-text>
                    </span>
                    <span class="ma8">
                        <el-button type="primary" @click="BackTo">回上頁</el-button>
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row class="fstart">
            <el-col :span="18">
                <div class="item-align ma4">
                    <span class="label-l fs16 ma4">設備名稱/型號/規格</span>
                    <span class="value-l fs16 ma4">
                        <el-input v-model="queryStr" placeholder="" @keydown.enter="onQuery" />
                    </span>
                    <span class="ma4">
                        <el-button type="primary" @click="onQuery">查詢</el-button>
                    </span>
                    <span class="ma4">
                        <el-button type="success">匯出</el-button>
                    </span>

                </div>
            </el-col>
            <el-col :span="6">
                <div class="item-align ma4">
                    <span class="label fs16 ma4">查詢數量:</span>
                    <span class="value fs16 ma4">{{queryCount}}</span>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-table v-if="orderitems" :data="orderitems" max-height="480" style="width: 100%" class="fs14 ma4">
                    <el-table-column fixed label="請購案號" prop="orderno" width="120" header-align="center" align="left" sortable />
                    <el-table-column fixed label="物品名稱/規範" width="320" prop="name" header-align="center" align="left" sortable />
                    <el-table-column label="單價" prop="unit_price" width="100" header-align="center" align="right" sortable />
                    <el-table-column label="數量" prop="quantity" width="80" header-align="center" align="right" sortable />
                    <el-table-column label="單位" prop="unit" width="60" header-align="center" align="center" />
                    <el-table-column label="幣別" prop="currency" width="60" header-align="center" align="center" />
                    <el-table-column label="匯率" prop="exchangerate" width="60" header-align="center" align="center" />
                    <el-table-column label="料號" prop="materialcode" width="140" header-align="center" align="center">
                        <template #default="scope">
                            <el-button link type="primary" @click="handleMaterialcode(scope)">
                                {{ scope.row.materialcode }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="工程編號" prop="jobno" width="130" header-align="center" align="left" sortable>
                        <template #default="scope">
                            <el-button link type="primary" @click="handleClick(scope)">
                                {{ scope.row.jobno }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="交貨日期" prop="delivery_date" width="120" header-align="center" align="cneter" sortable />
                    <el-table-column label="驗收日期" prop="receivecheck_date" width="120" header-align="center" align="center" sortable />

                </el-table>
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
.ma4 {
    margin: 4px;
}
.ma8 {
    margin: 8px;
}
.fstart {
    display: flex;
    align-items: center;
    justify-content: start;
}
.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
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
</style>
