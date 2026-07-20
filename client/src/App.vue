<script setup>
import { ref, onMounted } from "vue";
import account from "@/components/account.vue";
import usermenu from "@/components/usermenu.vue";

onMounted(() => {
    //console.log('pview user:', user);
});

</script>
<template>
    <div>
        <el-container>
            <el-header class="header-font" height="48px">
                <el-row :gutter="0">
                    <el-col class="header" :span="2"><router-link to="/">首頁</router-link></el-col>
                    <el-col class="header" :span="2"><router-link to="/overview">導覽</router-link></el-col>
                    <el-col class="header" :span="3"><router-link to="/document">設計文件</router-link></el-col>
                    <el-col class="header" :span="3"><router-link to="/project">工程管理</router-link></el-col>
                    <el-col class="header" :span="12"></el-col>
                    <el-col class="header" :span="2">
                        <account />
                        <!--
                        <div class="item-align ma4">
                            <account />
                            <usermenu />
                        </div>
                        -->
                    </el-col>
                    <!--
                    <el-col class="header" :span="2">
                        <el-button type="primary" class="mdi mdi-24px mdi-apps" />
                    </el-col>
                    -->
                </el-row>
            </el-header>

            <el-main class="">
                <router-view />
            </el-main>

        </el-container>
    </div>
</template>
<style>
div {
    font-family: Consolas, Microsoft JhengHei, SimHei;
}

li {
    list-style-type: none;
}

a {
    text-decoration: none;
}

.flex-grow {
    flex-grow: 1;
}

.header {
    display: flex;
    /* 水平置中 */
    justify-content: center;
    /* 垂直置中 */
    align-content: center;
    flex-wrap: wrap;
    height: 48px;
}

.header-font {
    font-size: 18px;
    font-weight: bold;
}

.el-header {
    border-bottom: solid;
    border-bottom-color: #d9d9d9;
    border-bottom-width: thin;
}

.item-align {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

</style>