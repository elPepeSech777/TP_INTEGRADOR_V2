import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORIAS, TIPOS, formatCurrency, formatDate } from '../utils/constants';
import './Listado.css';

const Listado = () => {
  const { movimientos, eliminarMovimiento } = useApp();
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    texto: '',
    categoria: '',
    tipo: '',
    orden: 'fecha-desc',
    fechaDesde: '',
    fechaHasta: '',
    montoMin: '',
    montoMax: ''
  });

  const filtrarMovimientos = () => {
    return movimientos.filter(mov => {
      const coincideTexto = mov.descripcion.toLowerCase().includes(filtros.texto.toLowerCase());
      const coincideCategoria = !filtros.categoria || mov.categoria === filtros.categoria;
      const coincideTipo = !filtros.tipo || mov.tipo === filtros.tipo;
      const fechaMov = new Date(mov.fecha);
      const coincideFechaDesde = !filtros.fechaDesde || fechaMov >= new Date(filtros.fechaDesde);
      const coincideFechaHasta = !filtros.fechaHasta || fechaMov <= new Date(filtros.fechaHasta);
      const coincideMontoMin = filtros.montoMin === '' || mov.monto >= Number(filtros.montoMin);
      const coincideMontoMax = filtros.montoMax === '' || mov.monto <= Number(filtros.montoMax);
      return coincideTexto && coincideCategoria && coincideTipo && coincideFechaDesde && coincideFechaHasta && coincideMontoMin && coincideMontoMax;
    });
  };

  const ordenarMovimientos = (movs) => {
    return [...movs].sort((a, b) => {
      switch (filtros.orden) {
        case 'fecha-desc':
          return new Date(b.fecha) - new Date(a.fecha);
        case 'fecha-asc':
          return new Date(a.fecha) - new Date(b.fecha);
        case 'monto-desc':
          return b.monto - a.monto;
        case 'monto-asc':
          return a.monto - b.monto;
        default:
          return 0;
      }
    });
  };

  const movimientosFiltrados = ordenarMovimientos(filtrarMovimientos());

  const formatearFecha = (fecha) => formatDate(fecha);
  const formatearMonto = (monto) => formatCurrency(monto);

  return (
    <div className="listado">
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          value={filtros.texto}
          onChange={(e) => setFiltros(prev => ({ ...prev, texto: e.target.value }))}
          className="filtro-input"
        />
        
        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
          className="filtro-select"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filtros.tipo}
          onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
          className="filtro-select"
        >
          <option value="">Todos los tipos</option>
          <option value={TIPOS.INGRESO}>Ingresos</option>
          <option value={TIPOS.GASTO}>Gastos</option>
        </select>

        <select
          value={filtros.orden}
          onChange={(e) => setFiltros(prev => ({ ...prev, orden: e.target.value }))}
          className="filtro-select"
        >
          <option value="fecha-desc">Fecha (más reciente)</option>
          <option value="fecha-asc">Fecha (más antigua)</option>
          <option value="monto-desc">Monto (mayor)</option>
          <option value="monto-asc">Monto (menor)</option>
        </select>

        <input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
          className="filtro-input"
          aria-label="Fecha desde"
        />

        <input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
          className="filtro-input"
          aria-label="Fecha hasta"
        />

        <input
          type="number"
          min="0"
          placeholder="Monto mín."
          value={filtros.montoMin}
          onChange={(e) => setFiltros(prev => ({ ...prev, montoMin: e.target.value }))}
          className="filtro-input"
        />

        <input
          type="number"
          min="0"
          placeholder="Monto máx."
          value={filtros.montoMax}
          onChange={(e) => setFiltros(prev => ({ ...prev, montoMax: e.target.value }))}
          className="filtro-input"
        />
      </div>

      <div className="movimientos">
        {movimientosFiltrados.length === 0 ? (
          <div className="sin-movimientos">
            <p>No hay movimientos que coincidan con los filtros</p>
          </div>
        ) : (
          movimientosFiltrados.map(mov => (
            <div key={mov.id} className={`movimiento ${mov.tipo}`}>
              <div className="movimiento-info">
                <h3>{mov.descripcion}</h3>
                <p className="categoria">{mov.categoria}</p>
                <p className="fecha">{formatearFecha(mov.fecha)}</p>
              </div>
              <div className="movimiento-monto">
                <span className={`monto ${mov.tipo}`}>
                  {mov.tipo === TIPOS.INGRESO ? '+' : '-'}{formatearMonto(mov.monto)}
                </span>
                <div className="botones-movimiento">
                  <button
                    onClick={() => navigate(`/editar/${mov.id}`)}
                    className="btn-editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarMovimiento(mov.id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Listado;
