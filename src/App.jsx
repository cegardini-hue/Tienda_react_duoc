import { Routes, Route } from 'react-router-dom';
import NavbarTienda from './components/NavbarTienda';
import TiendaView from './views/TiendaView';
import DetalleProductoView from './views/DetalleProductoView';
import CarritoView from './views/CarritoView';
import CategoriasView from './views/CategoriasView';
import CheckoutView from './views/CheckoutView';
import PagoExitosoView from './views/PagoExitosoView';
import PagoErrorView from './views/PagoErrorView';
import LoginView from './views/LoginView';
import RegistroView from './views/RegistroView';
import ContactoView from './views/ContactoView';

// Importaciones desde la subcarpeta admin dentro de views
import AdminLayout from './views/admin/AdminLayout';
import AdminProductosView from './views/AdminProductosView';

function App() {
  return (
    <>
      <NavbarTienda />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<TiendaView />} />
        <Route path="/producto/:id" element={<DetalleProductoView />} />
        <Route path="/categorias" element={<CategoriasView />} />
        <Route path="/carrito" element={<CarritoView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/pago-exitoso" element={<PagoExitosoView />} />
        <Route path="/pago-error" element={<PagoErrorView />} />
        <Route path="/contacto" element={<ContactoView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/registro" element={<RegistroView />} />

        {/* Ruta Protegida de Administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="productos" element={<AdminProductosView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;