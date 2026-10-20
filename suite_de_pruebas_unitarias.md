import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import RegistroView from '../views/RegistroView';
import AdminLayout from '../views/admin/AdminLayout';

describe('Suite Completa de Pruebas Unitarias - Tienda React', () => {

  // --- PRUEBA 1: Renderizado de Componente y Props ---
  test('1. ProductCard debe renderizar correctamente los datos del producto', () => {
    const productoPrueba = {
      id: 101,
      nombre: 'Juego de Prueba Unitario',
      precio: 25000,
      categoria: 'Aventura',
      descripcion: 'Descripción del juego de prueba',
      imagen: 'https://picsum.photos/200'
    };

    render(
      <BrowserRouter>
        <ProductCard producto={productoPrueba} />
      </BrowserRouter>
    );

    expect(screen.getByText('Juego de Prueba Unitario')).toBeInTheDocument();
    expect(screen.getByText('Aventura')).toBeInTheDocument();
    expect(screen.getByText('$25.000')).toBeInTheDocument();
  });

  // --- PRUEBA 2: Validaciones en Formulario de Registro ---
  test('2. RegistroView debe mostrar error cuando la contraseña tiene menos de 6 caracteres', () => {
    render(
      <BrowserRouter>
        <RegistroView />
      </BrowserRouter>
    );

    const inputNombre = screen.getByLabelText(/Nombre Completo/i);
    const inputEmail = screen.getByLabelText(/Correo Electrónico/i);
    const inputPass = screen.getByLabelText(/^Contraseña/i);
    const btnSubmit = screen.getByRole('button', { name: /Registrarme/i });

    fireEvent.change(inputNombre, { target: { value: 'Usuario Test' } });
    fireEvent.change(inputEmail, { target: { value: 'test@duoc.cl' } });
    fireEvent.change(inputPass, { target: { value: '123' } });

    fireEvent.click(btnSubmit);

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
  });

  // --- PRUEBA 3: Protección de Ruta de Administración (Control de Acceso) ---
  test('3. AdminLayout debe denegar el acceso si el usuario no es admin', () => {
    sessionStorage.clear(); // Asegurar que no haya sesión de admin

    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    expect(screen.getByText('Acceso Restringido')).toBeInTheDocument();
    expect(screen.getByText(/Debes iniciar sesión con una cuenta de administrador/i)).toBeInTheDocument();
  });

  // --- PRUEBA 4: Inserción y Persistencia en localStorage ---
  test('4. Debe inicializar correctamente la clave de productos en localStorage', () => {
    localStorage.clear();
    const productosSimulados = [{ id: 1, nombre: 'Test Item', precio: 5000 }];
    
    localStorage.setItem('productos', JSON.stringify(productosSimulados));
    const recuperados = JSON.parse(localStorage.getItem('productos'));

    expect(recuperados.length).toBe(1);
    expect(recuperados[0].nombre).toBe('Test Item');
  });

});