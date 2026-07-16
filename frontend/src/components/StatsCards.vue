<script setup>
defineProps({
  totalVentasDia: { type: Number, required: true },
  contadorVentas: { type: Number, required: true },
  ticketPromedio: { type: Number, required: true },
});
</script>

<template>
  <div class="stats-cards">
    <div class="card stat-card">
      <span class="label">Total del día</span>
      <span class="value">${{ totalVentasDia.toFixed(2) }}</span>
    </div>
    <div class="card stat-card">
      <span class="label">N° de ventas</span>
      <span class="value">{{ contadorVentas }}</span>
    </div>
    <div class="card stat-card">
      <span class="label">Ticket promedio</span>
      <span class="value">${{ ticketPromedio.toFixed(2) }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-sm);
  margin-bottom: 2rem;
}
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.label {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-green);
}
@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }
  .stat-card:last-child {
    grid-column: span 2;
  }
}
</style>
