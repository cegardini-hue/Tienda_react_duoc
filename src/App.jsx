import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavbarTienda from './components/NavbarTienda';
import TiendaView from './views/TiendaView';
import DetalleProductoView from './views/DetalleProductoView';
import CategoriasView from './views/CategoriasView';
import CarritoView from './views/CarritoView';
import CheckoutView from './views/CheckoutView';
import PagoExitosoView from './views/PagoExitosoView';
import PagoErrorView from './views/PagoErrorView';
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
          <Route path="/categorias" element={<CategoriasView />} />
          <Route path="/carrito" element={<CarritoView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/pago-exitoso" element={<PagoExitosoView />} />
          <Route path="/pago-error" element={<PagoErrorView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegistroView />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="productos" element={<AdminProductosView />} />
            <Route path="productos/nuevo" element={<AdminAgregarProductoView />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;