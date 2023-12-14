<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { defineProps, ref } from 'vue'

const props = defineProps(['data']);

const statistics = ref(props.data);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartData = {
    labels: Object.keys(statistics.value),
    datasets: [{ 
        label: 'Nº de transações',
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