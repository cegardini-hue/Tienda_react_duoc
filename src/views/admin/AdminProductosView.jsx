import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminProductosView() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  function cargarProductos() {
    const datos = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductos(datos);
  }

  function eliminarProducto(id) {
    const confirmar = window.confirm('¿Deseas eliminar este producto?');
    if (!confirmar) return;

    const nuevosProductos = productos.filter((p) => p.id !== id);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setProductos(nuevosProductos);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <Button as={Link} to="/admin/productos/nuevo" variant="success">
          ➕ Agregar Nuevo
        </Button>
      </div>

      <Table responsive bordered hover align="middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                  className="rounded"
                />
              </td>
              <td className="fw-bold">{prod.nombre}</td>
              <td>{prod.categoria}</td>
              <td>${prod.precio.toLocaleString('es-CL')}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarProducto(prod.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default AdminProductosView;