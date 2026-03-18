<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import _ from 'lodash';
import * as util from '@/util/utils.js';
import { ccode } from '@/assets/colorcode.js';

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
const tno = ref(null);

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

const renderChart = (teamno, otlist) => {    
    let rdata = [...otlist];
    //
    tno.value = teamno;
    let yearmonth = _.map(rdata, 'yearmonth');
    let compensation_total = _.map(rdata, 'compensation_total');
    let overtime_total = _.map(rdata, 'overtime_total');
    let ot_total = _.map(rdata, 'ot_total');

    //const myChart = echarts.init(chart.value);
    let options = {
        title: {
            text: `${teamno} 加班時數`,
            //subtext: b.totalbudget.toLocaleString(),
            left: 'left',
            //subtext: `合計: ${_.sum(ot_total)}`
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
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },            
            //data: teamno
            data: yearmonth
        },
        yAxis: {
            type: 'value'
            //type: 'category',
            //data: member
        },
        series: [
            {
                name: '加班時數:',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                itemStyle:{
                    color: ccode.green4
                },
                emphasis: {
                    focus: 'series'
                },
                //data: ot_total
                data: overtime_total
            },
            {
                name: '抵休時數:',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                itemStyle:{
                    color: ccode.blue4
                },
                emphasis: {
                    focus: 'series'
                },
                //data: ot_total
                data: compensation_total
            },
            {
                name: '總加班時數:',
                type: 'line',
                smooth: true,
                //stack: 'total',
                itemStyle:{
                    color: ccode.gold5
                },
                //emphasis: {
                //    focus: 'series'
                //},
                //data: ot_total
                data: ot_total
            },

        ]
    };
    myChart.setOption(options);
    myChart.resize({
        width: yearmonth.length * 80,
        height: 250
    });
    myChart.on('click', onClick);
    
};

const onClick = (params) => {
    //console.log(params.name);

    //emits('onClick', params.name);
    emits('onClick', {teamno: tno.value, yearmonth: params.name});
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
