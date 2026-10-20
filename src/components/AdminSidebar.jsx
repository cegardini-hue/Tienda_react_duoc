import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function AdminSidebar() {
  return (
    <div className="bg-dark text-white p-3 rounded mb-4" style={{ minHeight: '300px' }}>
      <h4 className="mb-3">Panel Admin</h4>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/admin/productos" className="text-white">
          📦 Listar Productos
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/productos/nuevo" className="text-white">
          ➕ Agregar Producto
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default AdminSidebar;