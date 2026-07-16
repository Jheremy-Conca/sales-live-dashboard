<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { useChartTheme } from '../composables/useChartTheme';

const props = defineProps({
  salesByRegion: { type: Object, required: true }, // { "Norte": 1200, ... }
});

const { baseOptions, chartPalette } = useChartTheme();

const chartData = computed(() => {
  const entries = Object.entries(props.salesByRegion);
  return {
    labels: entries.map(([region]) => region),
    datasets: [
      {
        data: entries.map(([, total]) => total),
        backgroundColor: chartPalette,
        borderColor: '#1a1a1a',
        borderWidth: 2,
      },
    ],
  };
});

const chartOptions = {
  ...baseOptions,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#ccc', boxWidth: 12, padding: 12 },
    },
  },
};
</script>

<template>
  <div class="card">
    <h3>🌍 Ventas por región</h3>
    <div class="chart-container">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
