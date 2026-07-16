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
└── frontend/         # Cliente que consume la API y el socket
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

Ver `frontend/README.md` (o completar según el stack usado).

## Variables de entorno

Ver `backend/.env.example` para la lista completa. **Nunca subir el `.env` real** — ya está cubierto por `.gitignore`.
