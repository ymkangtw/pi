<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ccode } from '@/assets/colorcode.js';

//--------------------------------
// Local Variable
//--------------------------------
const options = ref([
    { name: 'KPI', link: '/PS01', color1: ccode.red6, color2: ccode.red1 },
    { name: '各廠處工程狀況分析', link: '/PS02', color1: ccode.blue6, color2: ccode.blue1 },
    { name: '加班統計', link: '/PS03', color1: ccode.gold6, color2: ccode.gold1 },
    //{ name: '', link: '/PS04', color1: ccode.green6, color2: ccode.green1 },
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
                                <p class="title">統計資料</p>
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
.ma4 {
    margin: 4px;
}
.ma8 {
    margin: 8px;
}
.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
}
.title {
    font-size: 26px;
    font-weight: bold;
}
.shadow {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
}

.shadow:hover {
    box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.5);
}
</style>
