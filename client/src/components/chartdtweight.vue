<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import _ from 'lodash';

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

const renderChart = (ptc, tcr) => {
    let raw = _.map(ptc, o => { return { ...o }});
    let rdata = _.filter(raw, (item) => {
        return item.count > 0;
    });
    let wt = tcr[0];
    //console.log('rdata: ', rdata);
    _.map(rdata, (item) => {
        switch (item.jobtype) {
            case 'I': item.ratio = wt.id_wt; break;
            case 'B': item.ratio = wt.bd_wt; break;
            case 'D': item.ratio = wt.dd_wt; break;
            case 'E': item.ratio = wt.dcs_wt; break;
            case 'F': item.ratio = wt.plc_wt; break;
            case 'C': item.ratio = wt.cnt_wt; break;
            case 'P': item.ratio = wt.buy_wt; break;
            case 'K': item.ratio = wt.con_wt; break;
            case 'T': item.ratio = wt.com_wt; break;
            case 'R': item.ratio = wt.rpt_wt; break;
        }
    });
    //console.log(rdata);
    let legend_data = [];
    let series_data = [];
    _.map(rdata, (item) => {
        legend_data.push(item.category);
        series_data.push({value: item.ratio, name: item.category});
    });

    //const myChart = echarts.init(chart.value);  
    let options = {
        title: {
            text: '設計比重',
            //subtext: b.totalbudget.toLocaleString(),
            left: 'left'
        },
        tooltip: {
            trigger: 'item',
            //formatter: '{a} <br/>{b} : {c} ({d}%)'
            formatter: (param) => { 
                let value = param.data.value;
                let name = param.data.name;
                return `${name}<br/>${value}%`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: legend_data
        },
        series: [
            {
                name: '設計比重',
                type: 'pie',
                radius: ['60%'],
                center: ['50%', '60%'],
                data: series_data,
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
