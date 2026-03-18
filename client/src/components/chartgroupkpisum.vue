<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import _ from 'lodash';
import * as util from '@/util/utils.js';

//--------------------------------
// Component Property (Input)
//--------------------------------
const props = defineProps({
    param: {
        type: Array,
        default: []
    }
});

//--------------------------------
// Local Variable
//--------------------------------
const chart = ref(null);
const memberCount = ref();

const width = ref(600);
const height = ref(400);

var myChart;
//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    //console.log(sGroup.value);
    //renderChart();
    //memberCount.value = 5;
    myChart = echarts.init(chart.value);
});

const renderChart = (kpilist) => {    
    let rdata = [...kpilist];
    memberCount.value = rdata.length;
    //console.log(memberCount.value);
    //console.log(rdata);
    //let memberid = [];
    let member = [];
    let sum_gendwg = [];
    let sum_approvaldwg = [];    
    let sum_dcsdwg = [];
    let sum_plcdwg = [];
    let sum_commh = [];
    
    for (let item of rdata) {
        //memberid.push(item.employeeno);
        //member.push(item.name);
        member.push(`${item.employeeno}\n${item.name}`);
        sum_gendwg.push(item.sum_gendwg);
        sum_approvaldwg.push(item.sum_approvaldwg);
        sum_dcsdwg.push(item.sum_dcsdwg);
        sum_plcdwg.push(item.sum_plcdwg);
        sum_commh.push(item.sum_commh);
    }

    //const myChart = echarts.init(chart.value);  
    let options = {
        title: {
            text: 'KPI金額 (元)',
            //subtext: b.totalbudget.toLocaleString(),
            left: 'left'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            //orient: 'vertical',
            left: 'right',
            //top: '3%',
            //data: legend_data
            data: ['自設', '審查', 'DCS', 'PLC', '試車']
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            //nameTextStyle: { fontSize: 16, fontWeight: 'bold' },
            type: 'value'
            //type: 'category',
            //data: member,
        },
        yAxis: {
            //type: 'value'
            type: 'category',
            data: member
        },
        series: [
            {
                name: '自設',
                type: 'bar',
                stack: 'total',
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series'
                },
                data: sum_gendwg
            },
            {
                name: '審查',
                type: 'bar',
                stack: 'total',
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series'
                },
                data: sum_approvaldwg
            },
            {
                name: 'DCS',
                type: 'bar',
                stack: 'total',
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series'
                },
                data: sum_dcsdwg
            },
            {
                name: 'PLC',
                type: 'bar',
                stack: 'total',
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series'
                },
                data: sum_plcdwg
            },
            {
                name: '試車',
                type: 'bar',
                stack: 'total',
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series'
                },
                data: sum_commh
            },                      
        ]
    };

    myChart.on('click', (params) => {
        //console.log(params);
        

    });    
    myChart.setOption(options);
    myChart.resize({
        //width: memberCount.value * 100,
        //height: 400
        width: 640,
        height: memberCount.value * 80
    });
};

const OnClick = () => {
    //console.log(sGroup.value);
    emits('onChange', '');
}

//--------------------------------
// Component Event
//--------------------------------
const emits = defineEmits(
    ['onChange']
);

//--------------------------------
// Component Expose Property (Input/Output)
//--------------------------------

defineExpose({
    renderChart
});


</script>

<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<style scoped>

</style>
