import { TIPOS } from './constants';

export const datosMock = [
  {
    id: '1',
    descripcion: 'Sueldo mensual',
    categoria: 'Otros',
    tipo: TIPOS.INGRESO,
    monto: 150000,
    fecha: '2024-10-01T00:00:00.000Z'
  },
  {
    id: '2',
    descripcion: 'Compra en supermercado',
    categoria: 'Alimentación',
    tipo: TIPOS.GASTO,
    monto: 25000,
    fecha: '2024-10-02T00:00:00.000Z'
  },
  {
    id: '3',
    descripcion: 'Transporte público',
    categoria: 'Transporte',
    tipo: TIPOS.GASTO,
    monto: 5000,
    fecha: '2024-10-03T00:00:00.000Z'
  },
  {
    id: '4',
    descripcion: 'Cine con amigos',
    categoria: 'Ocio',
    tipo: TIPOS.GASTO,
    monto: 8000,
    fecha: '2024-10-04T00:00:00.000Z'
  },
  {
    id: '5',
    descripcion: 'Freelance diseño',
    categoria: 'Otros',
    tipo: TIPOS.INGRESO,
    monto: 30000,
    fecha: '2024-10-05T00:00:00.000Z'
  },
  {
    id: '6',
    descripcion: 'Medicamentos',
    categoria: 'Salud',
    tipo: TIPOS.GASTO,
    monto: 12000,
    fecha: '2024-10-06T00:00:00.000Z'
  },
  {
    id: '7',
    descripcion: 'Alquiler',
    categoria: 'Vivienda',
    tipo: TIPOS.GASTO,
    monto: 60000,
    fecha: '2024-10-07T00:00:00.000Z'
  },
  {
    id: '8',
    descripcion: 'Luz y gas',
    categoria: 'Servicios',
    tipo: TIPOS.GASTO,
    monto: 15000,
    fecha: '2024-10-08T00:00:00.000Z'
  }
];
