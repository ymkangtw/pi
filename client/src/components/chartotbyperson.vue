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
const yearmonth = ref(null);

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

const renderChart = (data, potlist) => {    
    tno.value = data.teamno;
    yearmonth.value =  data.yearmonth;
    let rdata = [...potlist];
    //
    let member = [];
    let compensation_total = [];
    let overtime_total = [];
    let ot_total = [];


    for (let item of rdata) {
        member.push(`${item.employeeno}\n${item.name == null ? '' : item.name}`);
        compensation_total.push(item.compensation_total);
        overtime_total.push(item.overtime_total);
        ot_total.push(item.ot_total);
    }

    //let yearmonth = _.map(rdata, 'yearmonth');
    //let compensation_total = _.map(rdata, 'compensation_total');
    //let overtime_total = _.map(rdata, 'overtime_total');    
    //let ot_total = _.map(rdata, 'ot_total');

    //const myChart = echarts.init(chart.value);
    let options = {
        title: {
            text: `${tno.value} ${yearmonth.value} 個人加班時數`,
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
        toolbox: {
            show: true,
            feature: {
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        */
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
            data: member
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
/*
            {
                name: '總加班時數:',
                type: 'scatter',
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
*/
        ]
    };
    myChart.setOption(options);
    myChart.resize({
        width: member.length * 70 > 300 ? member.length * 70 : 300 ,
        height: 250
    });
    myChart.on('click', onClick);
    
};

const onClick = (params) => {
    //console.log(params.name);
    let parts = params.name.split('\n');
    let employeeno = parts[0];
    let name = parts[1];
    //emits('onClick', params.name);
    emits('onClick', {teamno: tno.value, yearmonth: yearmonth.value, employeeno: employeeno, name: name});
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
