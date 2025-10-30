import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TIPOS } from '../utils/constants';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import './Resumen.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Resumen = () => {
  const { movimientos } = useApp();

  const calcularTotales = () => {
    const ingresos = movimientos
      .filter(mov => mov.tipo === TIPOS.INGRESO)
      .reduce((sum, mov) => sum + mov.monto, 0);
    
    const gastos = movimientos
      .filter(mov => mov.tipo === TIPOS.GASTO)
      .reduce((sum, mov) => sum + mov.monto, 0);
    
    const balance = ingresos - gastos;
    
    return { ingresos, gastos, balance };
  };

  const calcularGastosPorCategoria = () => {
    const gastos = movimientos.filter(mov => mov.tipo === TIPOS.GASTO);
    const porCategoria = {};
    
    gastos.forEach(mov => {
      porCategoria[mov.categoria] = (porCategoria[mov.categoria] || 0) + mov.monto;
    });
    
    return Object.entries(porCategoria)
      .map(([categoria, monto]) => ({ categoria, monto }))
      .sort((a, b) => b.monto - a.monto);
  };

  const calcularEvolucionMensual = () => {
    const porMes = {};
    
    movimientos.forEach(mov => {
      const fecha = new Date(mov.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      if (!porMes[mes]) {
        porMes[mes] = { ingresos: 0, gastos: 0 };
      }
      
      if (mov.tipo === TIPOS.INGRESO) {
        porMes[mes].ingresos += mov.monto;
      } else {
        porMes[mes].gastos += mov.monto;
      }
    });
    
    return Object.entries(porMes)
      .map(([mes, datos]) => ({
        mes,
        ingresos: datos.ingresos,
        gastos: datos.gastos,
        balance: datos.ingresos - datos.gastos
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  };

  const { ingresos, gastos, balance } = calcularTotales();
  const gastosPorCategoria = calcularGastosPorCategoria();
  const evolucionMensual = calcularEvolucionMensual();

  const temaOscuroActivo = typeof document !== 'undefined' && document.body.classList.contains('dark');
  const colorTexto = temaOscuroActivo ? '#ffffff' : '#2c3e50';
  const gridColor = temaOscuroActivo ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const coloresCategorias = ['#e74c3c','#9b59b6','#3498db','#1abc9c','#f1c40f','#e67e22','#2ecc71','#34495e','#c0392b','#7f8c8d'];

  const doughnutData = useMemo(() => ({
    labels: gastosPorCategoria.map(g => g.categoria),
    datasets: [{
      data: gastosPorCategoria.map(g => g.monto),
      backgroundColor: gastosPorCategoria.map((_, i) => coloresCategorias[i % coloresCategorias.length]),
      borderWidth: 0
    }]
  }), [gastosPorCategoria]);

  const doughnutOptions = useMemo(() => ({
    plugins: {
      legend: { position: 'bottom', labels: { color: colorTexto } },
      tooltip: { callbacks: { label: (ctx) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(ctx.parsed) } }
    }
  }), [colorTexto]);

  const lineLabels = evolucionMensual.map(e => e.mes);
  const lineData = useMemo(() => ({
    labels: lineLabels,
    datasets: [
      { label: 'Ingresos', data: evolucionMensual.map(e => e.ingresos), borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.2)', tension: 0.2 },
      { label: 'Gastos', data: evolucionMensual.map(e => e.gastos), borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.2)', tension: 0.2 },
      { label: 'Balance', data: evolucionMensual.map(e => e.balance), borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.2)', tension: 0.2 }
    ]
  }), [evolucionMensual]);

  const lineOptions = useMemo(() => ({
    responsive: true,
    plugins: { legend: { labels: { color: colorTexto } }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(ctx.parsed.y)}` } } },
    scales: {
      x: { ticks: { color: colorTexto, callback: (val, i) => formatearMes(lineLabels[i]) }, grid: { color: gridColor } },
      y: { ticks: { color: colorTexto, callback: (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(value) }, grid: { color: gridColor } }
    }
  }), [colorTexto, gridColor, lineLabels]);

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  const formatearMes = (mes) => {
    const [año, mesNum] = mes.split('-');
    const fecha = new Date(año, mesNum - 1);
    return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="resumen">
      <h2>Resumen Financiero</h2>
      
      <div className="totales">
        <div className="total-card ingresos">
          <h3>Total Ingresos</h3>
          <p className="monto">{formatearMonto(ingresos)}</p>
        </div>
        <div className="total-card gastos">
          <h3>Total Gastos</h3>
          <p className="monto">{formatearMonto(gastos)}</p>
        </div>
        <div className={`total-card balance ${balance >= 0 ? 'positivo' : 'negativo'}`}>
          <h3>Balance</h3>
          <p className="monto">{formatearMonto(balance)}</p>
        </div>
      </div>

      <div className="graficos">
        <div className="grafico-container">
          <h3>Gastos por Categoría</h3>
          {gastosPorCategoria.length > 0 ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <p className="sin-datos">No hay gastos registrados</p>
          )}
        </div>

        <div className="grafico-container">
          <h3>Evolución Mensual</h3>
          {evolucionMensual.length > 0 ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p className="sin-datos">No hay datos para mostrar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resumen;
