<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import BasicSvc from '@/service/basic.service.js';
import DrawingnoService from '@/service/drawingno.service.js';
import FactorycodeService from '@/service/factorycode.service.js';

import * as dayjs from 'dayjs';
import * as util from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';
import { ElMessage } from 'element-plus';

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    visible: { type: Boolean, default: false }
});

//--------------------------------
// Local Variable
//--------------------------------
const userStore = useUserStore();
const sel = useSelectionStore();
var user = userStore.identity;
const router = useRouter();

const basicSvc = new BasicSvc();
const drawingnoSvc = new DrawingnoService();
const factorycodeSvc = new FactorycodeService();

const b = ref();

const dwgno = ref();
const showDialogAddNew = ref();


const DlgVisible = ref();

const newDwgno = ref({
    jobno: '',
    employeeno: '',
    drawingtitle: '',
    drawingno_st: '',
    drawingno_sp: ''    
});
const fcode = ref();
const sFcode = ref();
const fOptions = ref([]);
const sCount = ref();
const cOptions = ref([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '30', value: 30 },
    { label: '40', value: 40 },
    { label: '50', value: 50 },
    { label: '60', value: 60 },
    { label: '70', value: 70 },
    { label: '80', value: 80 },
    { label: '90', value: 90 },                                    
]);


//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    b.value = await basicSvc.getBy({ jobno: sel.sJobno });
    //console.log('b:', b.value);
    
    dwgno.value = await drawingnoSvc.getBy({ jobno: sel.sJobno });
    fcode.value = await factorycodeSvc.getAll();
    for (let item of fcode.value) {
        fOptions.value.push({ label: `${item.fcode}, ${item.name}`, value: item.fcode});
    }

    newDwgno.value.jobno = sel.sJobno;
    newDwgno.value.employeeno = user.employeeno;
    newDwgno.value.drawingtitle = b.value[0].jobname;

    //console.log(newDwgno.value);
    //console.log(fOptions.value);
});

const closeDialog = () => {
    //console.log(sGroup.value);
    emits('closeDialog');
}

const addNewDrawingno = async () => {
    //let str = `add new`;
    //console.log(str);
    //let querystr = `${user.ofgroup1.substring(0, 3)}-${user.ofgroup1.substring(3, 4)}-%`;
    let curyear = dayjs().format('YYYY');
    let lastDwgno = _.last(dwgno.value);
    //console.log(lastDwgno.drawingno_sp);
    let lastno = 0;
    let year;
    if (_.isEmpty(lastDwgno)) {
        lastno = 0;
    } else {
        /*
        let lastyear = lastDwgno.drawingno_sp.substring(9, 13);
        console.log(lastyear);
        if (lastyear != curyear) {
            year = curyear;
            lastno = 0;
        } else {
            year = lastyear;
            lastno = parseInt(lastDwgno.drawingno_sp.slice(-3));
        }
        */
        lastno = parseInt(lastDwgno.drawingno_sp.slice(-3));
    }
    year = curyear;


    let newno_st = `${user.ofgroup1.substring(0, 3)}-${user.ofgroup1.substring(3, 4)}-${sFcode.value}-${year}-${String(lastno + 1).padStart(3, '0')}`;
    let newno_sp = `${user.ofgroup1.substring(0, 3)}-${user.ofgroup1.substring(3, 4)}-${sFcode.value}-${year}-${String(lastno + sCount.value).padStart(3, '0')}`;    

    newDwgno.value.drawingno_st = newno_st;
    newDwgno.value.drawingno_sp = newno_sp;
    //console.log(newDwgno.value);
    let error = 0;
    await drawingnoSvc.create(newDwgno.value).then((data) => { data == 'created' ? error = error : error = error + 1 });
    error == 0 ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });
    dwgno.value = await drawingnoSvc.getBy({ jobno: sel.sJobno });
};

const handleDelete = async (value) => {
    let delObj = {
        jobno: value.row.jobno,
        employeeno: value.row.employeeno,
        drawingno_st: value.row.drawingno_st
    };
    //console.log(value.row);
    let error = 0;
    await drawingnoSvc.remove(delObj).then((data) => { data == 'removed' ? error = error : error = error + 1 });
    error == 0 ? ElMessage({ message: '刪除成功', type: 'success' }) : ElMessage({ message: '刪除失敗', type: 'error' });
    dwgno.value = await drawingnoSvc.getBy({ jobno: sel.sJobno });
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
        <el-dialog v-model="DlgVisible" title="圖號管理" width="80%" align-center>
            <template>
                <el-dialog v-model="showDialogAddNew" width="80%" title="新增圖號" append-to-body>
                    <el-row>
                        <el-col :span="24">
                            <div class="item-align ma4">
                                <span class="label ma2">圖件名稱</span>
                                <span class="value ma2">
                                    <el-input v-model="newDwgno.drawingtitle" style="width: 320px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label ma2">場別代碼</span>
                                <span class="value ma2">
                                    <el-select v-model="sFcode" placeholder="Select">
                                        <el-option v-for="item in fOptions" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label ma2">圖號數量</span>
                                <span class="value ma2">
                                    <el-select v-model="sCount" placeholder="Select">
                                        <el-option v-for="item in cOptions" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                    <hr />
                    <el-row class="fend">

                        <el-button type="primary" class="ma2" @click=" addNewDrawingno(); showDialogAddNew = false; ">
                            確定
                        </el-button>
                        <el-button type="primary" class="ma2" @click=" showDialogAddNew = false; ">
                            取消
                        </el-button>
                       
                    </el-row>                
                </el-dialog>
            </template>
            <el-row>
                <el-col :span="24">

                    <el-table v-if="dwgno" :data="dwgno" max-height="480" style="width: 100%" class="fs14 ma4">
                        <el-table-column fixed label="工程編號" prop="jobno" width="140" header-align="center" align="left" />
                        <el-table-column fixed label="職工編號" prop="employeeno" width="120" header-align="center" align="left" />
                        <el-table-column label="圖件名稱" prop="drawingtitle" width="360" header-align="center" align="center" />
                        <el-table-column label="圖號(開始)" prop="drawingno_st" width="180" header-align="center" align="center" />
                        <el-table-column label="圖號(結束)" prop="drawingno_sp" width="180" header-align="center" align="center" />
                        <el-table-column fixed="right" label="動作" width="90" header-align="center" align="center">
                        <template #default="scope">
                            <el-button link type="primary" @click="handleDelete(scope)">
                                刪除
                            </el-button>
                        </template>
                    </el-table-column>                        
                    </el-table>

                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">

                    <el-button type="primary" @click="showDialogAddNew = true;">
                        新增
                    </el-button>

                    <el-button @click="closeDialog">
                        取消
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
