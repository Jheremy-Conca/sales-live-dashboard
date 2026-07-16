<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { useChartTheme } from '../composables/useChartTheme';

const props = defineProps({
  history: { type: Array, required: true }, // [{ time, total }]
});

const { baseOptions, axisOptions, legendLight, chartPalette } = useChartTheme();

const chartData = computed(() => ({
  labels: props.history.map((h) => h.time),
  datasets: [
    {
      label: 'Ventas acumuladas del día ($)',
      data: props.history.map((h) => h.total),
      borderColor: chartPalette[0],
      backgroundColor: 'rgba(74, 222, 128, 0.15)',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: chartPalette[0],
    },
  ],
}));

const chartOptions = {
  ...baseOptions,
  plugins: {
    legend: legendLight,
  },
  scales: {
    x: axisOptions,
    y: axisOptions,
  },
};
</script>

<template>
  <div class="card chart-wrapper">
    <div class="chart-container chart-container--tall">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container--tall {
  height: 350px;
}
@media (max-width: 900px) {
  .chart-container--tall {
    height: 260px;
  }
}
</style>
