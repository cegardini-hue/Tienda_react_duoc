import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavbarTienda from './components/NavbarTienda';
import { productosIniciales } from './data/productosIniciales';

// Importaremos las vistas a medida que las vayamos creando
function App() {
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (!productosGuardados) {
      localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
  }, []);

  return (
    <>
      <NavbarTienda />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<h1 className="text-center my-4">Página Principal - Home</h1>} />
          <Route path="/categorias" element={<h2>Vista Categorías</h2>} />
          <Route path="/ofertas" element={<h2>Vista Ofertas</h2>} />
          <Route path="/contacto" element={<h2>Vista Contacto</h2>} />
          <Route path="/login" element={<h2>Vista Login</h2>} />
          <Route path="/registro" element={<h2>Vista Registro</h2>} />
        </Routes>
      </div>
    </>
  );
}

export default App;