import { useApp } from '../context/AppContext';
import './Ajustes.css';

const Ajustes = () => {
  const { temaOscuro, toggleTema, limpiarDatos } = useApp();

  const handleLimpiarDatos = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      limpiarDatos();
      alert('Todos los datos han sido eliminados.');
    }
  };

  return (
    <div className="ajustes">
      <h2>Configuración</h2>
      
      <div className="ajustes-container">
        <div className="ajuste-item">
          <div className="ajuste-info">
            <h3>Tema</h3>
            <p>Cambiar entre tema claro y oscuro</p>
          </div>
          <div className="ajuste-control">
            <label className="switch">
              <input
                type="checkbox"
                checked={temaOscuro}
                onChange={toggleTema}
              />
              <span className="slider"></span>
            </label>
            <span className="tema-texto">
              {temaOscuro ? 'Oscuro' : 'Claro'}
            </span>
          </div>
        </div>

        <div className="ajuste-item">
          <div className="ajuste-info">
            <h3>Datos</h3>
            <p>Eliminar todos los movimientos registrados</p>
          </div>
          <div className="ajuste-control">
            <button 
              onClick={handleLimpiarDatos}
              className="btn-danger"
            >
              Limpiar Datos
            </button>
          </div>
        </div>

        <div className="ajuste-item">
          <div className="ajuste-info">
            <h3>Información</h3>
            <p>Versión 1.0.0 - Mi Presupuesto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
