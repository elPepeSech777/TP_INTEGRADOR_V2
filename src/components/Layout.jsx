import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { temaOscuro, toggleTema } = useApp();
  const location = useLocation();

  return (
    <div className={`app ${temaOscuro ? 'dark' : 'light'}`}>
      <header className="header">
        <div className="container">
          <h1 className="logo">Mi Presupuesto</h1>
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Listado
            </Link>
            <Link 
              to="/nuevo" 
              className={`nav-link ${location.pathname === '/nuevo' ? 'active' : ''}`}
            >
              Nuevo
            </Link>
            <Link 
              to="/resumen" 
              className={`nav-link ${location.pathname === '/resumen' ? 'active' : ''}`}
            >
              Resumen
            </Link>
            <Link 
              to="/ajustes" 
              className={`nav-link ${location.pathname === '/ajustes' ? 'active' : ''}`}
            >
              Ajustes
            </Link>
          </nav>
          <button className="theme-toggle" onClick={toggleTema}>
            {temaOscuro ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
