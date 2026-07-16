# 📊 Sales Live Dashboard

Dashboard de ventas en tiempo real. El backend genera ventas simuladas cada 3 segundos, las persiste en PostgreSQL (Neon) vía Prisma, y las transmite en vivo al frontend por Socket.IO.

## Estructura del proyecto

```
sales-live-dashboard/
├── backend/          # API Express + Socket.IO + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.js
│   │   ├── data/products.js
│   │   ├── db/connection.js
│   │   ├── models/Sale.js
│   │   └── socket/salesEmitter.js
│   ├── .env.example
│   └── package.json
└── frontend/         # Vue 3 + Pinia + Chart.js (vue-chartjs)
    ├── src/
    │   ├── App.vue              # única vista, arma todo el layout
    │   ├── main.js               # registro central de Chart.js + Pinia
    │   ├── components/
    │   │   ├── StatsCards.vue
    │   │   ├── RecentOrders.vue
    │   │   ├── LiveChart.vue
    │   │   ├── TopProducts.vue
    │   │   └── SalesByRegion.vue
    │   ├── composables/
    │   │   └── useChartTheme.js  # paleta y opciones de Chart.js compartidas
    │   ├── services/
    │   │   └── socket.js         # cliente de socket.io
    │   └── stores/
    │       └── salesStore.js     # Pinia: estado global de ventas en vivo
    ├── netlify.toml
    └── package.json
```

## Backend

### Requisitos
- Node.js 18+
- Una base de datos PostgreSQL (este proyecto usa [Neon](https://neon.tech))

### Setup local

```bash
cd backend
npm install
cp .env.example .env   # completa DATABASE_URL con tu connection string de Neon
npx prisma migrate dev --name init
npm run dev
```

El servidor arranca en `http://localhost:4000` (o el puerto que definas en `.env`).

### Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/sales/today` | Últimas ventas del día |
| GET | `/api/sales/stats` | Total, contador y ticket promedio del día |
| GET | `/api/sales/by-product` | Ventas agrupadas por producto |
| GET | `/api/sales/by-region` | Ventas agrupadas por región |
| GET | `/api/health` | Health check |

### Evento en tiempo real (Socket.IO)

El backend emite `new-sale` cada vez que se genera una venta:

```js
socket.on('new-sale', ({ sale, stats }) => {
  // sale: { id, product, region, quantity, amount, createdAt }
  // stats: { totalVentasDia, contadorVentas, ticketPromedio }
});
```

### Deploy (Render)

1. Sube el repo a GitHub.
2. En Render: **New → Web Service**, conecta el repo.
3. **Root Directory**: `backend`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. Variables de entorno: `DATABASE_URL` (de Neon), `CLIENT_URL` (URL del frontend deployado).

## Frontend

Vue 3 + Pinia + Chart.js (`vue-chartjs`). Sin vue-router: `App.vue` es la única vista y arma todo el layout directamente.

### Setup local

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:4000" > .env
npm run dev
```

### Cómo fluyen los datos

1. `main.js` registra los componentes de Chart.js una sola vez (evita registros duplicados por componente) y monta Pinia.
2. `App.vue` llama a `store.initSocket()` en `onMounted`, que conecta `services/socket.js` y escucha el evento `new-sale`.
3. `stores/salesStore.js` centraliza todo el estado: feed de últimas ventas, stats del día, ventas por producto/región e historial para el gráfico de línea.
4. Cada componente (`StatsCards`, `RecentOrders`, `LiveChart`, `TopProducts`, `SalesByRegion`) recibe su parte del estado por props, sin tocar el store directamente.

### Deploy (Netlify)

1. **Base directory**: `frontend`
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. Variable de entorno: `VITE_API_URL` = URL del backend en Render.
5. Después del primer deploy, actualiza `CLIENT_URL` en Render con la URL final de Netlify (o el CORS bloquea el socket).

## Variables de entorno

Ver `backend/.env.example` para la lista completa. **Nunca subir el `.env` real** — ya está cubierto por `.gitignore`.
