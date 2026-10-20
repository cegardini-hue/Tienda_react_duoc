import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavbarTienda from './components/NavbarTienda';
import TiendaView from './views/TiendaView';
import DetalleProductoView from './views/DetalleProductoView';
import LoginView from './views/LoginView';
import RegistroView from './views/RegistroView';
import AdminLayout from './views/admin/AdminLayout';
import AdminProductosView from './views/admin/AdminProductosView';
import AdminAgregarProductoView from './views/admin/AdminAgregarProductoView';
import { productosIniciales } from './data/productosIniciales';

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
          <Route path="/" element={<TiendaView />} />
          <Route path="/producto/:id" element={<DetalleProductoView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegistroView />} />
          
          {/* Rutas anidadas de administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="productos" element={<AdminProductosView />} />
            <Route path="productos/nuevo" element={<AdminAgregarProductoView />} />
          </Route>

          <Route path="/categorias" element={<h2>Vista Categorías</h2>} />
          <Route path="/ofertas" element={<h2>Vista Ofertas</h2>} />
          <Route path="/contacto" element={<h2>Vista Contacto</h2>} />
        </Routes>
      </div>
    </>
  );
}

export default App;