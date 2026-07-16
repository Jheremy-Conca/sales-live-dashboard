// Colores y opciones compartidas entre LiveChart, SalesByRegion y TopProducts.
// Antes estos valores estaban hardcodeados y duplicados en cada componente.

export const chartPalette = ['#4ade80', '#60a5fa', '#facc15', '#f472b6', '#a78bfa'];

export function useChartTheme() {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
  };

  const axisOptions = {
    ticks: { color: '#888' },
    grid: { color: '#222' },
  };

  const legendLight = {
    labels: { color: '#ccc' },
  };

  return { chartPalette, baseOptions, axisOptions, legendLight };
}
