<script setup>
import { ref, onMounted } from 'vue';

const urls = [
    'pic/pic1.jpg',
    'pic/pic2.jpg',
    'pic/pic3.jpg',
    'pic/pic4.jpg',
    'pic/pic5.jpg',
];

const pics = [
    { pic: 'pic/pic1.jpg', text: '工程管理'},
    { pic: 'pic/pic2.jpg', text: '工程設計'},
    { pic: 'pic/pic3.jpg', text: '品質管理'},
    { pic: 'pic/pic4.jpg', text: '工安環保'},
    { pic: 'pic/pic5.jpg', text: '教育訓練'}
];

onMounted(() => {

});

</script>
<template>
    <div>
        <el-row :gutter="20" class="container">

            <el-col :span="2"></el-col>
            <el-col :span="20">
                <el-row>
                    <el-card
                        v-for="(item, idx) in pics" 
                        :body-style="{ padding: '0px' }"
                        :class="['card', 'shadow', 'ma8']"
                        shadow="never"
                    >
                        <el-image :src="`${item.pic}`" style="width: 320px; height: 240px">
                        </el-image>
                        <div style="padding: 12px">
                            <span>{{ item.text }}</span>
                        </div>
 
                    </el-card>
                </el-row>
            </el-col>
            <el-col :span="2"></el-col>
            <!--
            <el-col :span="2"></el-col>
            <el-col :span="20">
                <el-image v-for="url in urls" :key="url" :src="url" style="width: 300px; height: 300px">
                </el-image>
                <el-row>
                    <el-col :span="24">

                    </el-col>
                </el-row>
                
            </el-col>
            <el-col :span="2"></el-col>
        -->

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

.card {
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border-width: 0px;
}

.image {
    width: 100%;
    display: block;
}
</style>