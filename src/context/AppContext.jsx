import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { datosMock } from '../utils/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [movimientos, setMovimientos] = useLocalStorage(STORAGE_KEYS.MOVIMIENTOS, datosMock);
  const [temaOscuro, setTemaOscuro] = useLocalStorage(STORAGE_KEYS.TEMA, false);

  const agregarMovimiento = (movimiento) => {
    const nuevoMovimiento = {
      ...movimiento,
      id: Date.now().toString(),
      monto: Number(movimiento.monto),
      fecha: new Date(movimiento.fecha).toISOString()
    };
    setMovimientos(prev => [...prev, nuevoMovimiento]);
  };

  const editarMovimiento = (id, movimientoActualizado) => {
    setMovimientos(prev => 
      prev.map(mov => 
        mov.id === id 
          ? { ...movimientoActualizado, id, monto: Number(movimientoActualizado.monto), fecha: new Date(movimientoActualizado.fecha).toISOString() }
          : mov
      )
    );
  };

  const eliminarMovimiento = (id) => {
    setMovimientos(prev => prev.filter(mov => mov.id !== id));
  };

  const limpiarDatos = () => {
    setMovimientos([]);
  };

  const toggleTema = () => {
    setTemaOscuro(prev => !prev);
  };

  const value = {
    movimientos,
    temaOscuro,
    agregarMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    limpiarDatos,
    toggleTema
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
