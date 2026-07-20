<script setup>
import { ref, onMounted } from 'vue';
import ContentSvc from '@/service/contents.service.js';
import { trimJSON, loadObj } from '@/util/utils.js';
import { useUserStore } from '@/stores/user.js';
import { useSelectionStore } from '@/stores/selection.js';
import { ElMessage } from 'element-plus';

//--------------------------------
// Local Variable
//--------------------------------
const userStore = useUserStore();
const sel = useSelectionStore();
var user = userStore.identity;
const contentSvc = new ContentSvc();
const c = ref();
const sTab = ref('content');

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    getContent();
});

const getContent = async () => {
    await contentSvc
        .getBy({ jobno: sel.sJobno })
        .then((data) => {
            //console.log(data);
            if (data.length < 1) {
                c.value = {
                    jobno: sel.sJobno, 
                    workcontent: '', 
                    basicby: '', 
                    hardwareby: '', 
                    softwareby: '', 
                    condesignby: '', 
                    materialby: '', 
                    constructionby: '', 
                    equipmentby: '', 
                    workduty: ''
                };
            } else {
                c.value = trimJSON(data[0]);
            }
            //c.value = data[0];
            //c.value = trimJSON(data[0]);
        });
};

const updateContent = async () => {

    let data = await contentSvc.getBy({ jobno: sel.sJobno });
    if (data.length < 1) {
        await contentSvc.create({ jobno: sel.sJobno });
    }

    await contentSvc
        .update(c.value)
        .then((data) => {
            data == 'updated' ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });
        });

};

</script>
<template>
    <div v-if="c">
        <el-row class="fend ma8">
            <el-button type="primary" @click="updateContent">儲存</el-button>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-tabs tab-position="left" v-model="sTab" :class="['t-area']">
                    <el-tab-pane name="content">
                        <template #label>
                            <span class="tabtext">工程內容</span>
                        </template>

                        <el-input v-model="c.workcontent" :rows=16 type="textarea" style="font-size: 16px;"/>
                    </el-tab-pane>
                    <el-tab-pane name="duty">
                        <template #label>
                            <span class="tabtext">權責單位</span>
                        </template>
                        <div class="item-align m8">
                            <span class="label ma2">基本設計</span>
                            <span class="value ma2">
                                <el-input v-model="c.basicby" />
                            </span>
                        </div>
                        <div class="item-align m8">
                            <span class="label ma2">硬體設計</span>
                            <span class="value ma2">
                                <el-input v-model="c.hardwareby" />
                            </span>
                        </div>
                        <div class="item-align m8">
                            <span class="label ma2">軟體設計</span>
                            <span class="value ma2">
                                <el-input v-model="c.softwareby" />
                            </span>
                        </div>
                        <div class="item-align m8">
                            <span class="label ma2">設備供料</span>
                            <span class="value ma2">
                                <el-input v-model="c.equipmentby" />
                            </span>
                        </div>                        
                        <div class="item-align m8">
                            <span class="label ma2">施工設計</span>
                            <span class="value ma2">
                                <el-input v-model="c.condesignby" />
                            </span>
                        </div>
                        <div class="item-align m8">
                            <span class="label ma2">施工材料</span>
                            <span class="value ma2">
                                <el-input v-model="c.materialby" />
                            </span>
                        </div>                        
                        <div class="item-align m8">
                            <span class="label ma2">施工</span>
                            <span class="value ma2">
                                <el-input v-model="c.constructionby" />
                            </span>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="workduty">
                        <template #label>
                            <span class="tabtext">分工說明</span>
                        </template>

                        <el-input v-model="c.workduty" :rows=16 type="textarea" />
                    </el-tab-pane>                    
                </el-tabs>
            </el-col>


        </el-row>

    </div>
</template>

<style scoped>
.tabtext {
    font-size: 18px;
    font-weight: bold;
}
.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
}
.left-col {
    width: 500px;
}

.right-col {
    width: 300px;
}
.t-area {
    font-size: 16px;
    width: 900px;
}

.ma8 {
    margin: 8px;
}
.ma2 {
    margin: 2px;
}
.label {
    width: 120px;
}

.value {
    width: 140px;
}
.fend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
