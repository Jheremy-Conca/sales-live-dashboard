import { defineStore } from 'pinia';
import { socket } from '../services/socket';

export const useSalesStore = defineStore('sales', {
  state: () => ({
    connected: false,
    recentSales: [],       // últimas ventas (feed)
    totalVentasDia: 0,
    contadorVentas: 0,
    ticketPromedio: 0,
    salesByProduct: {},    // { "Laptop Gamer": 5, ... } -> para top productos
    salesByRegion: {},     // { "Norte": 1200, ... } -> para gráfico por región
    chartHistory: [],      // [{ time, total }] -> para el gráfico de línea
  }),

  actions: {
    initSocket() {
      socket.on('connect', () => {
        this.connected = true;
        console.log('🔌 Conectado al servidor');
      });

      socket.on('disconnect', () => {
        this.connected = false;
      });

      socket.on('new-sale', ({ sale, stats }) => {
        this.addSale(sale, stats);
      });
    },

    addSale(sale, stats) {
      // Feed de últimas ventas (máx 15)
      this.recentSales.unshift(sale);
      if (this.recentSales.length > 15) this.recentSales.pop();

      // Stats generales
      // Number(...) por si acaso: si `amount` es Decimal en Prisma, puede
      // llegar como string al serializarse por el socket.
      this.totalVentasDia = Number(stats.totalVentasDia);
      this.contadorVentas = Number(stats.contadorVentas);
      this.ticketPromedio = Number(stats.ticketPromedio);

      // Top productos
      if (!this.salesByProduct[sale.product]) {
        this.salesByProduct[sale.product] = 0;
      }
      this.salesByProduct[sale.product] += sale.quantity;

      // Ventas por región
      if (!this.salesByRegion[sale.region]) {
        this.salesByRegion[sale.region] = 0;
      }
      this.salesByRegion[sale.region] += Number(sale.amount);

      // Historial para el gráfico de línea (máx 20 puntos)
      // sale.createdAt (no sale.timestamp: ese campo ya no existe desde
      // que las ventas se persisten con Prisma, ver salesEmitter.js).
      this.chartHistory.push({
        time: new Date(sale.createdAt).toLocaleTimeString(),
        total: this.totalVentasDia,
      });
      if (this.chartHistory.length > 20) this.chartHistory.shift();
    },
  },
});