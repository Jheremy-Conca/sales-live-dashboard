import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler, // <- faltaba: sin esto, el "fill: true" del LiveChart no pinta el área
} from 'chart.js';

// Registro único y centralizado. Antes cada componente de gráfico
// hacía su propio ChartJS.register(...), duplicando código y
// arriesgando registros inconsistentes entre componentes.
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const app = createApp(App);
app.use(createPinia()); // si ya tenías esto configurado distinto, mantené tu versión
app.mount('#app');
