import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIAS, TIPOS } from '../utils/constants';
import './Listado.css';

const Listado = () => {
  const { movimientos, eliminarMovimiento } = useApp();
  const [filtros, setFiltros] = useState({
    texto: '',
    categoria: '',
    tipo: '',
    orden: 'fecha-desc'
  });

  const filtrarMovimientos = () => {
    return movimientos.filter(mov => {
      const coincideTexto = mov.descripcion.toLowerCase().includes(filtros.texto.toLowerCase());
      const coincideCategoria = !filtros.categoria || mov.categoria === filtros.categoria;
      const coincideTipo = !filtros.tipo || mov.tipo === filtros.tipo;
      
      return coincideTexto && coincideCategoria && coincideTipo;
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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

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
                <button
                  onClick={() => eliminarMovimiento(mov.id)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Listado;
