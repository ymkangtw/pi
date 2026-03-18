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

    let member = [];
    let accu_genmh = [];
    let accu_approvalmh = [];    
    let accu_dcsmh = [];
    let accu_plcmh = [];
    let accu_commh = [];
    
    for (let item of rdata) {
        //member.push(item.name);
        member.push(`${item.employeeno}\n${item.name}`);
        accu_genmh.push(item.accu_genmh);
        accu_approvalmh.push(item.accu_approvalmh);
        accu_dcsmh.push(item.accu_dcsmh);
        accu_plcmh.push(item.accu_plcmh);
        accu_commh.push(item.accu_commh);
    }

    //const myChart = echarts.init(chart.value);  
    let options = {
        title: {
            text: '工時 (hr)',
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
            type: 'value'
            //type: 'category',
            //data: member

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
                data: accu_genmh
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
                data: accu_approvalmh
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
                data: accu_dcsmh
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
                data: accu_plcmh
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
                data: accu_commh
            },
        ]
    };
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
