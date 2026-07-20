<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ccode } from '@/assets/colorcode.js';
//--------------------------------
// Local Variable
//--------------------------------
const options = ref([
    { name: '工程案件查詢', link: '/PQ01', color1: ccode.gold6, color2: ccode.gold1 },
    { name: '請購案件查詢', link: '/PQ02', color1: ccode.green6, color2: ccode.green1 },
    //{ name: '測試', link: '/PQ03', color1: ccode.blue5, color2: ccode.blue1 },

]);

const router = useRouter();
//--------------------------------
// Local Function
//--------------------------------
const OnClick = (link) => {
    router.push(link);
};

const BackTo = () => {
    router.push('/project');
};

</script>
<template>
    <div>
        <el-row>      
            <el-col :span="4"></el-col>
            <el-col :span="16">
                <el-row>
                    <el-col :span="24">
                        <div class="item-align ma4">
                            <span class="ma8">
                                <p class="title">工程資料查詢</p>
                            </span>
                            <span class="ma8">
                                <el-button type="primary" @click="BackTo">回上頁</el-button>
                            </span>
                        </div>
                    </el-col>                    
                </el-row>

                <el-row class="container">
                    <el-card 
                        v-for="(item, idx) in options"
                        :class="['card', 'shadow', 'ma8']"
                        :style="{'background-image': `linear-gradient(to bottom right, ${item.color1}, ${item.color2})`}"
                        shadow="never"
                        @click="OnClick(item.link)"
                    >
                        <div>
                            {{ item.name }}
                        </div>
                        
                    </el-card>
                </el-row>

            </el-col>
            <el-col :span="4"></el-col>
        </el-row>
    </div>
</template>
<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: start;    
}
.caption {
    font-size: 24px;
    font-weight: bold;
}
.card {
    color: white;
    text-shadow: 0.1em 0.1em 0.2em black;
    font-size: 24px;
    font-weight: bold;
    width: 300px;
    height: 120px;
    cursor: pointer;
    border-width: 0px;
}
.block {
    font-size: 24px;
    font-weight: bold;
    width: 600px;
    border-width: 0px;
}
.title {
    font-size: 26px;
    font-weight: bold;
}


</style>
