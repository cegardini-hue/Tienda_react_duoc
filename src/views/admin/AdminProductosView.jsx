import { useEffect, useState } from 'react';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { deleteProduct, getApiErrorMessage, getProducts } from '../../api/productService';

function AdminProductosView() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal)
      .then(setProductos)
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'No fue posible cargar los productos.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, []);

  async function eliminarProducto(id) {
    const confirmar = window.confirm('¿Deseas eliminar este producto?');
    if (!confirmar) return;

    setEliminandoId(id);
    setError('');
    try {
      await deleteProduct(id);
      setProductos((actuales) => actuales.filter((producto) => producto.id !== id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No fue posible eliminar el producto.'));
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <Button as={Link} to="/admin/productos/nuevo" variant="success">
          ➕ Agregar Nuevo
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <p role="status"><Spinner size="sm" animation="border" className="me-2" />Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-muted">No hay productos disponibles.</p>
      ) : (
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
              <td>${Number(prod.precio).toLocaleString('es-CL')}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/productos/editar/${encodeURIComponent(prod.id)}`}
                  variant="primary"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarProducto(prod.id)}
                  disabled={eliminandoId === prod.id}
                >
                  {eliminandoId === prod.id ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
    </>
  );
}

export default AdminProductosView;