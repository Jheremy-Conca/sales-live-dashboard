  export const products = [
    { id: 1, name: 'Laptop Gamer', price: 1200, region: 'Norte' },
    { id: 2, name: 'Mouse Inalámbrico', price: 25, region: 'Sur' },
    { id: 3, name: 'Teclado Mecánico', price: 80, region: 'Centro' },
    { id: 4, name: 'Monitor 27"', price: 300, region: 'Norte' },
    { id: 5, name: 'Audífonos Bluetooth', price: 60, region: 'Este' },
    { id: 6, name: 'Webcam HD', price: 45, region: 'Oeste' },
    { id: 7, name: 'Silla Ergonómica', price: 220, region: 'Sur' },
    { id: 8, name: 'SSD 1TB', price: 90, region: 'Centro' },
  ];

  export function getRandomProduct() {
    return products[Math.floor(Math.random() * products.length)];
  }