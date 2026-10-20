import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('Pruebas Unitarias Componente ProductCard', () => {
  const productoPrueba = {
    id: 1,
    nombre: 'Juego de Prueba',
    precio: 19990,
    categoria: 'Aventura',
    descripcion: 'Descripción de prueba del juego',
    imagen: 'https://picsum.photos/200'
  };

  test('Debe renderizar el nombre del producto y la categoría correctamente', () => {
    render(
      <BrowserRouter>
        <ProductCard producto={productoPrueba} />
      </BrowserRouter>
    );

    expect(screen.getByText('Juego de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Aventura')).toBeInTheDocument();
  });

  test('Debe mostrar el precio formateado correctamente', () => {
    render(
      <BrowserRouter>
        <ProductCard producto={productoPrueba} />
      </BrowserRouter>
    );

    expect(screen.getByText('$19.990')).toBeInTheDocument();
  });
});