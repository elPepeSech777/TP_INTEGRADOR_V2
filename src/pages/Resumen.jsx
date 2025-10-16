import { useApp } from '../context/AppContext';
import { TIPOS } from '../utils/constants';
import './Resumen.css';

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
            <div className="categorias">
              {gastosPorCategoria.map(({ categoria, monto }) => (
                <div key={categoria} className="categoria-item">
                  <div className="categoria-info">
                    <span className="categoria-nombre">{categoria}</span>
                    <span className="categoria-monto">{formatearMonto(monto)}</span>
                  </div>
                  <div className="categoria-barra">
                    <div 
                      className="categoria-progreso"
                      style={{ 
                        width: `${(monto / Math.max(...gastosPorCategoria.map(g => g.monto))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="sin-datos">No hay gastos registrados</p>
          )}
        </div>

        <div className="grafico-container">
          <h3>Evolución Mensual</h3>
          {evolucionMensual.length > 0 ? (
            <div className="evolucion">
              {evolucionMensual.map(({ mes, ingresos, gastos, balance }) => (
                <div key={mes} className="mes-item">
                  <div className="mes-header">
                    <h4>{formatearMes(mes)}</h4>
                    <span className={`balance-mes ${balance >= 0 ? 'positivo' : 'negativo'}`}>
                      {formatearMonto(balance)}
                    </span>
                  </div>
                  <div className="mes-detalle">
                    <div className="mes-ingresos">
                      <span>Ingresos: {formatearMonto(ingresos)}</span>
                    </div>
                    <div className="mes-gastos">
                      <span>Gastos: {formatearMonto(gastos)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="sin-datos">No hay datos para mostrar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resumen;
