import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIAS, TIPOS } from '../utils/constants';
import './Nuevo.css';

const validationSchema = Yup.object({
  descripcion: Yup.string().min(3, 'La descripción debe tener al menos 3 caracteres').required('La descripción es requerida'),
  categoria: Yup.string().required('La categoría es requerida'),
  tipo: Yup.string().oneOf([TIPOS.INGRESO, TIPOS.GASTO], 'Tipo inválido').required('El tipo es requerido'),
  monto: Yup.number().positive('El monto debe ser positivo').required('El monto es requerido'),
  fecha: Yup.date().max(new Date(), 'La fecha no puede ser futura').required('La fecha es requerida')
});

const Editar = () => {
  const { movimientos, editarMovimiento } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const movimiento = movimientos.find(m => m.id === id);

  if (!movimiento) {
    return (
      <div className="nuevo">
        <h2>Editar Movimiento</h2>
        <p className="error">No se encontró el movimiento solicitado.</p>
        <div className="botones">
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">Volver</button>
        </div>
      </div>
    );
  }

  const initialValues = {
    descripcion: movimiento.descripcion || '',
    categoria: movimiento.categoria || '',
    tipo: movimiento.tipo || '',
    monto: movimiento.monto !== undefined && movimiento.monto !== null ? movimiento.monto : '',
    fecha: new Date(movimiento.fecha).toISOString().split('T')[0]
  };

  const handleSubmit = (values, { setSubmitting }) => {
    editarMovimiento(id, values);
    setSubmitting(false);
    navigate('/');
  };

  return (
    <div className="nuevo">
      <h2>Editar Movimiento</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="formulario">
            <div className="campo">
              <label htmlFor="descripcion">Descripción</label>
              <Field type="text" id="descripcion" name="descripcion" placeholder="Ej: Compra en supermercado" />
              <ErrorMessage name="descripcion" component="div" className="error" />
            </div>

            <div className="campo">
              <label htmlFor="categoria">Categoría</label>
              <Field as="select" id="categoria" name="categoria">
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Field>
              <ErrorMessage name="categoria" component="div" className="error" />
            </div>

            <div className="campo">
              <label htmlFor="tipo">Tipo</label>
              <Field as="select" id="tipo" name="tipo">
                <option value="">Selecciona el tipo</option>
                <option value={TIPOS.INGRESO}>Ingreso</option>
                <option value={TIPOS.GASTO}>Gasto</option>
              </Field>
              <ErrorMessage name="tipo" component="div" className="error" />
            </div>

            <div className="campo">
              <label htmlFor="monto">Monto</label>
              <Field type="number" id="monto" name="monto" step="0.01" min="0" placeholder="0.00" />
              <ErrorMessage name="monto" component="div" className="error" />
            </div>

            <div className="campo">
              <label htmlFor="fecha">Fecha</label>
              <Field type="date" id="fecha" name="fecha" max={new Date().toISOString().split('T')[0]} />
              <ErrorMessage name="fecha" component="div" className="error" />
            </div>

            <div className="botones">
              <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</button>
              <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancelar</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Editar;


