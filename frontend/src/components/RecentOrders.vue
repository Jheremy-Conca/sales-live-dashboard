<script setup>
defineProps({
  sales: { type: Array, required: true },
});
</script>

<template>
  <div class="card recent-orders">
    <h3>🔔 Últimos pedidos</h3>
    <div class="orders-scroll">
      <transition-group name="list" tag="ul">
        <li v-for="sale in sales" :key="sale.id">
          <span class="product">{{ sale.product }}</span>
          <span class="region">{{ sale.region }}</span>
          <span class="amount">${{ Number(sale.amount).toFixed(2) }}</span>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.recent-orders {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Contenedor con scroll propio: el título queda fijo arriba,
   no se desplaza junto con la lista. */
.orders-scroll {
  max-height: 340px;
  overflow-y: auto;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: var(--border-color) transparent;
}
.orders-scroll::-webkit-scrollbar {
  width: 6px;
}
.orders-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.orders-scroll::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}
.orders-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Degradado sutil abajo: insinúa que hay más contenido sin
   depender del scrollbar nativo para comunicarlo. */
.recent-orders::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  background: linear-gradient(to bottom, transparent, var(--bg-card));
  pointer-events: none;
  border-radius: 0 0 var(--radius) var(--radius);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}
li:last-child {
  border-bottom: none;
}
.product {
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.region {
  color: var(--text-muted);
  flex-shrink: 0;
}
.amount {
  color: var(--accent-green);
  font-weight: 600;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .orders-scroll {
    max-height: 220px;
  }
}
</style>