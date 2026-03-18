<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
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

const renderChart = (b) => {
    //const myChart = echarts.init(chart.value);  
    let options = {
        title: {
            text: '預算金額',
            //subtext: b.totalbudget > 0 ? b.totalbudget.toLocaleString() : 0,
            subtext: b.totalbudget,
            left: 'left'
        },
        tooltip: {
            trigger: 'item',
            //formatter: '{a} <br/>{b} : {c} ({d}%)'
            formatter: (param) => { 
                let name = `${param.data.name} (${Math.round(param.data.value / util.pv(b.totalbudget) * 1000) / 10}%)`;
                let value = `${util.fv(param.data.value)}`;
                //console.log(param);
                return `${name}<br/>${value.toLocaleString()}`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: ['機械', '儀電設計', '儀電施工']
        },
        series: [
            {
                name: '預算金額',
                type: 'pie',
                radius: ['70%'],
                center: ['50%', '60%'],
                label: {
                    show: false,
                    position: 'center'
                },
                data: [
                    { value: util.pv(b.totalbudget) - util.pv(b.electricalbudget), name: '機械' },
                    { value: util.pv(b.y6tbudget), name: '儀電設計' },
                    { value: util.pv(b.y6nbudget), name: '儀電施工' },
                ],
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
