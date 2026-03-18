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
var myChart;
//--------------------------------
// Local Function
//--------------------------------
onMounted(() => {
    //console.log(sGroup.value);
    //renderChart();
    myChart = echarts.init(chart.value);
});

const renderChart = (memberkpi) => {
    let rdata = { ...memberkpi };
    //let rdata = _.map(memberkpi, o => { return { ...o }});
    //let rdata = _.filter(raw, (item) => {
    //    return item.count > 0;
    //});
    //let wt = tcr[0];
    //console.log(memberkpi);
    //console.log('rdata: ', rdata);
    //console.log(rdata);
    //let legend_data = [];
    //let series_data = [];
    //_.map(rdata, (item) => {
    //    legend_data.push(item.category);
    //    series_data.push({value: item.ratio, name: item.category});
    //});
    let sum_all = rdata.sum_gendwg + rdata.sum_approvaldwg + rdata.sum_dcsdwg + rdata.sum_plcdwg + rdata.sum_commh;

    //const myChart = echarts.init(chart.value);
    let options = {
        title: {
            text: '金額比重',
            //subtext: b.totalbudget.toLocaleString(),
            left: 'left'
        },
        tooltip: {
            trigger: 'item',
            //formatter: '{a} <br/>{b} : {c} ({d}%)'
            formatter: (param) => { 
                let value = `${util.fv(param.data.value)}`;
                let name = param.data.name;
                return `${name} ${sum_all == 0 ? 0 : parseFloat(param.data.value / sum_all * 100).toFixed(1)}%<br/>${value}`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            //data: legend_data
            data: ['自設', '審查', 'DCS', 'PLC', '試車']
        },
        series: [
            {
                name: '金額',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '60%'],
                //data: series_data,
                data: [
                    { value: rdata.sum_gendwg, name: '自設' },
                    { value: rdata.sum_approvaldwg, name: '審查' },
                    { value: rdata.sum_dcsdwg, name: 'DCS' },
                    { value: rdata.sum_plcdwg, name: 'PLC' },
                    { value: rdata.sum_commh, name: '試車' },
                ],
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },                
            }
        ]
    };
    myChart.setOption(options);
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
        <div ref="chart" style="width: 250px; height: 250px;"></div>
    </div>
</template>

<style scoped></style>
