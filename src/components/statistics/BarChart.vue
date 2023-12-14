<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { defineProps, ref } from 'vue'

const props = defineProps(['data']);

const statistics = ref(props.data);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = {
    labels: Object.keys(statistics.value),
    datasets: [{ 
        label: 'Nº de transações',
        data: Object.values(statistics.value),
        backgroundColor: '#3e95cd',
        borderWidth: 1
    }],
};

const chartOptions = {
    indexAxis: 'y',
    responsive: true,
  
};
</script>

<template>
    <Bar 
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
        v-if="statistics"
    />
</template>