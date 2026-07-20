<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import IsodocsSvc from '@/service/isodocs.service.js';

import _ from 'lodash';
import * as util from '@/util/utils.js';


//--------------------------------
// Local Variable
//--------------------------------
const router = useRouter();

const isodocsSvc = new IsodocsSvc();

const doc = ref();

const sOption = ref();
const Options = ref([
    { label: '標準/文件名稱', value: 'isoname' },
    { label: '標準編號', value: 'isono' },
    { label: '制定單位', value: 'formdept' },
]);
const queryCount = ref();

const queryStr = ref();
//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    //Query();
    sOption.value = Options.value[0].value;

});

const BackTo = () => {
    router.push('/document');
};

const onQuery = async () => {
    //console.log(queryStr.value);
    let queryObj;
    //console.log(sOption.value);
    let str;

    switch (sOption.value) {
        case 'isoname' :
            str = queryStr.value.replace(/\s/g, '%');
            queryObj = {
                isoname: `%${str}%`,
                docname: `%${str}%`
            };
            break;
        default:
            queryObj = { [sOption.value]: `%${queryStr.value}%`};

    }
    doc.value = await isodocsSvc.getBy(queryObj);
    queryCount.value = doc.value.length;
    //console.log(doc.value);
};

const handleClick = (scope) => {
    let filepath = scope.row.filepath;
    let filename = scope.row.filename;
    console.log(filepath + filename);
};

</script>
<template>
    <div>
        <el-row class="fstart">
            <el-col :span="24">
                <div class="item-align ma4">
                    <span class="ma8">
                        <el-text type="danger" tag="b" size="large">品質管理系統標準文件</el-text>
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
                    <span class="label-l fs16 ma4">
                        <el-select v-model="sOption">
                            <el-option v-for="item in Options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </span>
                    <span class="value-l fs16 ma4">
                        <el-input v-model="queryStr" placeholder="" @keydown.enter="onQuery" />
                    </span>
                    <span>
                        <el-button type="primary" @click="onQuery">查詢</el-button>
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
                <el-table v-if="doc" :data="doc" max-height="480" style="width: 100%" class="fs14 ma4">
                    <el-table-column fixed label="文件編號" prop="isodocid" width="140" header-align="center" align="left" sortable>
                        <template #default="scope">
                            <el-button link type="primary" @click="handleClick(scope)">
                                <a :href="`${scope.row.filepath}${scope.row.filename}`" download>
                                    {{ scope.row.isodocid }}
                                </a>
                            </el-button>
                        </template>                    
                    </el-table-column>
                    <el-table-column fixed label="標準名稱" prop="isoname" width="200"  header-align="center" align="left" sortable />
                    <el-table-column label="文件名稱" prop="docname" width="240" header-align="center" align="left" sortable />
                    <el-table-column label="版本" prop="isoversion" width="90" header-align="center" align="center" sortable />
                    <el-table-column label="ISO編號" prop="isono" width="120" header-align="center" align="center" sortable />
                    <!--
                    <el-table-column label="文件編號" prop="docno" width="100" header-align="center" align="center" sortable />
                    -->
                    <el-table-column label="核准日期" prop="approveddate" width="120" header-align="center" align="center" sortable />
                    <el-table-column label="制定單位" prop="formdept" width="120" header-align="center" align="center" sortable />
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
