<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { useChartTheme } from '../composables/useChartTheme';

const props = defineProps({
  salesByProduct: { type: Object, required: true }, // { "Laptop Gamer": 5, ... }
});

const { baseOptions, axisOptions, chartPalette } = useChartTheme();

// Ordena de mayor a menor y toma el top 5
const topFive = computed(() => {
  return Object.entries(props.salesByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
});

const chartData = computed(() => ({
  labels: topFive.value.map(([name]) => name),
  datasets: [
    {
      label: 'Unidades vendidas',
      data: topFive.value.map(([, qty]) => qty),
      backgroundColor: chartPalette[1],
      borderRadius: 6,
    },
  ],
}));

const chartOptions = {
  ...baseOptions,
  indexAxis: 'y', // barras horizontales
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: axisOptions,
    y: { ticks: { color: '#ccc' }, grid: { display: false } },
  },
};
</script>

<template>
  <div class="card">
    <h3>🏆 Top 5 productos</h3>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
