<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ccode } from '@/assets/colorcode.js';
//--------------------------------
// Local Variable
//--------------------------------
const options = ref([
    { name: '工程清單', link: '/PM01', color1: ccode.red5, color2: ccode.red1 },
    //{ name: '基本資料', link: '/PM02', color1: ccode.blue6, color2: ccode.blue1 },
    { name: '資料查詢', link: '/PM03', color1: ccode.blue5, color2: ccode.blue1 },
    { name: '統計資料', link: '/PM04', color1: ccode.gold5, color2: ccode.gold1 },
    { name: '工程報表', link: '/PM05', color1: ccode.green5, color2: ccode.green1 },

]);
const router = useRouter();

//--------------------------------
// Local Function
//--------------------------------
const OnClick = (link) => {
    router.push(link);
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
                                <p class="title">工程管理</p>
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
.title {
    font-size: 26px;
    font-weight: bold;
}
</style>