<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ccode } from '@/assets/colorcode.js';

//--------------------------------
// Local Variable
//--------------------------------
const options = ref([
    { name: '設計標準', link: '/ED01', color1: ccode.red5, color2: ccode.red1 },
    { name: '安全衛生', link: '/ED02', color1: ccode.blue5, color2: ccode.blue1 },
]);
const router = useRouter();

//--------------------------------
// Local Function
//--------------------------------
const OnClick = (link) => {
    router.push(link);
};
/*
const BackTo = () => {
    router.push('/project');
};
*/
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
                                <p class="title">設計文件</p>
                            </span>
                        <!--
                            <span class="ma8">
                                <el-button type="primary" @click="BackTo">回上頁</el-button>
                            </span>
                        -->
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
                        {{ item.name }}
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
</style>