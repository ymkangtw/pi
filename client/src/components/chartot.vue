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

const renderChart = (otlist) => {    
    let rdata = [...otlist];

    let team = _.map(rdata, 'teamno');
    let ot_total = _.map(rdata, 'ot_total');

    //const myChart = echarts.init(chart.value);
    let options = {
        title: {
            text: '加班時數統計',
            //text: '',
            //subtext: b.totalbudget.toLocaleString(),
            left: 'left',
            subtext: `合計: ${_.sum(ot_total)}`
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },    
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
            data: team
        },
        yAxis: {
            type: 'value'
            //type: 'category',
            //data: member
        },
        series: [
            {
                name: '工時:',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                itemStyle:{
                    color: ccode.gold4
                },
                emphasis: {
                    focus: 'series'
                },
                //data: ot_total
                data: ot_total
            }
        ]
    };
    myChart.setOption(options);
    myChart.resize({
        width: team.length * 80,
        height: 250
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
