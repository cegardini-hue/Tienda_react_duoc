import { useEffect, useState } from 'react';
import { Alert, Spinner, Table } from 'react-bootstrap';
import { getApiErrorMessage, getProducts } from '../../api/productService';

function SellerProductsView() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
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

  return (
    <>
      <h2 className="mb-4">Productos</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <p role="status"><Spinner size="sm" animation="border" className="me-2" />Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-muted">No hay productos disponibles.</p>
      ) : (
        <Table responsive bordered hover>
          <thead className="table-dark">
            <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th></tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>${Number(producto.precio).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default SellerProductsView;
