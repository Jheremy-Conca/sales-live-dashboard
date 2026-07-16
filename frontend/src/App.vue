<script setup>
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSalesStore } from './stores/salesStore';
import StatsCards from './components/StatsCards.vue';
import RecentOrders from './components/RecentOrders.vue';
import LiveChart from './components/LiveChart.vue';
import TopProducts from './components/TopProducts.vue';
import SalesByRegion from './components/SalesByRegion.vue';

const store = useSalesStore();
const {
  connected,
  recentSales,
  totalVentasDia,
  contadorVentas,
  ticketPromedio,
  chartHistory,
  salesByProduct,
  salesByRegion,
} = storeToRefs(store);

const hasData = computed(() => recentSales.value.length > 0);

onMounted(() => {
  store.initSocket();
});
</script>

<template>
  <div class="app">
    <header>
      <h1>📊 Sales Live Dashboard</h1>
      <span class="status" :class="{ on: connected }">
        <span class="dot" :class="{ on: connected }"></span>
        {{ connected ? 'En vivo' : 'Desconectado' }}
      </span>
    </header>

    <StatsCards
      :totalVentasDia="totalVentasDia"
      :contadorVentas="contadorVentas"
      :ticketPromedio="ticketPromedio"
    />

    <div v-if="!hasData" class="waiting">
      <div class="spinner"></div>
      <p>Esperando la primera venta...</p>
    </div>

    <template v-else>
      <div class="main-grid">
        <LiveChart :history="chartHistory" />
        <RecentOrders :sales="recentSales" />
      </div>

      <div class="secondary-grid">
        <TopProducts :salesByProduct="salesByProduct" />
        <SalesByRegion :salesByRegion="salesByRegion" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}
header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
h1 {
  margin: 0;
  font-size: 1.6rem;
}
.status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.status.on {
  color: var(--accent-green);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}
.dot.on {
  background: var(--accent-green);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--gap);
  margin-bottom: var(--gap);
  min-width: 0;
}
.secondary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap);
  min-width: 0;
}
.waiting {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: var(--text-muted);
  gap: 1rem;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-green);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .app {
    padding: 1rem;
  }
  .main-grid,
  .secondary-grid {
    grid-template-columns: 1fr;
  }
  h1 {
    font-size: 1.2rem;
  }
}
@media (max-width: 500px) {
  .status {
    font-size: 0.75rem;
  }
}
</style>
