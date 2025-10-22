import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Listado from './pages/Listado';
import Nuevo from './pages/Nuevo';
import Resumen from './pages/Resumen';
import Editar from './pages/Editar';
import Ajustes from './pages/Ajustes';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Listado />} />
            <Route path="/nuevo" element={<Nuevo />} />
            <Route path="/editar/:id" element={<Editar />} />
            <Route path="/resumen" element={<Resumen />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
