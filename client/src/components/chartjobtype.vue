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
//const memberCount = ref();

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

const renderChart = (prjlist) => {    
    let rdata = [...prjlist];
    //memberCount.value = rdata.length;
    //console.log(memberCount.value);
    //console.log(rdata);
    let jobs = _.countBy(rdata, 'jobtype');
    //console.log(jobs);
    let jobCount = Object.values(jobs);
    let jobType = Object.keys(jobs);
    //console.log('jobCount:', jobCount);
    //console.log('jobType:', jobType);

    //

/*
    let member = [];
    let accu_gendwg = [];
    let accu_approvaldwg = [];    
    let accu_dcsdwg = [];
    let accu_plcdwg = [];
    //let sum_commh = [];
    
    for (let item of rdata) {
        //member.push(item.name);
        member.push(`${item.employeeno}\n${item.name}`);
        accu_gendwg.push(item.accu_gendwg);
        accu_approvaldwg.push(item.accu_approvaldwg);
        accu_dcsdwg.push(item.accu_dcsdwg);
        accu_plcdwg.push(item.accu_plcdwg);
        //sum_commh.push(item.sum_commh);
    }
*/


    //const myChart = echarts.init(chart.value);
    let options = {
        title: {
            text: '工程件數統計',
            //subtext: b.totalbudget.toLocaleString(),
            left: 'left',
            subtext: `合計: ${rdata.length}`
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        /*
        legend: {
            //orient: 'vertical',
            left: 'right',
            top: '7%',
            //data: legend_data
            data: jobType
        },
        */
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            //type: 'value'
            type: 'category',
            data: jobType
        },
        yAxis: {
            type: 'value'
            //type: 'category',
            //data: member
        },
        series: [
            {
                name: '件數:',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: jobCount
            }
        ]
    };
    myChart.setOption(options);
    myChart.resize({
        width: jobType.length * 90,
        height: 300
    });
    myChart.on('click', onClick);
};

const onClick = (params) => {
    //console.log(params.name);

    emits('onClick', params.name);
}

//--------------------------------
// Component Event
//--------------------------------
const emits = defineEmits(
    ['onClick']
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
