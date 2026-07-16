import { getRandomProduct } from '../data/products.js';
import { createSale, getTodaysStats } from '../models/Sale.js';

export function startSalesEmitter(io) {
  setInterval(async () => {
    try {
      const product = getRandomProduct();
      const quantity = Math.floor(Math.random() * 3) + 1;
      const amount = product.price * quantity;

      // Persistimos la venta en Postgres en vez de solo llevar contadores
      // en memoria: si el servidor se reinicia, los totales no se pierden.
      const sale = await createSale({
        product: product.name,
        region: product.region,
        quantity,
        amount,
      });

      // Las stats se recalculan desde la DB (fuente única de verdad),
      // así el front que se conecta después ve los mismos números que
      // uno que ya estaba conectado desde el inicio.
      const stats = await getTodaysStats();

      io.emit('new-sale', { sale, stats });

      console.log(`💸 Nueva venta: ${sale.product} - $${sale.amount}`);
    } catch (err) {
      console.error('❌ Error generando venta:', err.message);
    }
  }, 3000); // cada 3 segundos entra una venta nueva
}