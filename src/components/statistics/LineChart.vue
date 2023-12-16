<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { defineProps, ref } from 'vue'

const props = defineProps(['data', 'label']);

const statistics = ref(props.data);
const label = ref(props.label);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartData = {
    labels: Object.keys(statistics.value),
    datasets: [{ 
        label: label.value,
        data: Object.values(statistics.value),
        backgroundColor: '#3e95cd',
        borderColor: '#3e95cd',
        tension: 0.2
    }],
};

const chartOptions = {
    responsive: true,
  
};
</script>

<template>
    <Line 
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        v-if="statistics"
    />
</template>