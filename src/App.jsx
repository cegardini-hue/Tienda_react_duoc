import { Routes, Route } from 'react-router-dom';
import NavbarTienda from './components/NavbarTienda';
import HomeView from './views/HomeView';
import ProductoDetalleView from './views/ProductoDetalleView';
import CarritoView from './views/CarritoView';
import LoginView from './views/LoginView';
import RegistroView from './views/RegistroView';
import ContactoView from './views/ContactoView';
import AdminLayout from './components/AdminLayout';
import AdminProductosView from './views/AdminProductosView';

function App() {
  return (
    <>
      <NavbarTienda />
      <Routes>
        {/* Rutas Públicas Principales */}
        <Route path="/" element={<HomeView />} />
        <Route path="/producto/:id" element={<ProductoDetalleView />} />
        <Route path="/carrito" element={<CarritoView />} />
        <Route path="/contacto" element={<ContactoView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/registro" element={<RegistroView />} />

        {/* Rutas Administrativas Protegidas */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="productos" element={<AdminProductosView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;