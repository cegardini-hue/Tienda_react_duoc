import { useState, useEffect } from 'react';
import { Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { getApiErrorMessage, getProducts } from '../api/productService';

function TiendaView() {
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
    <Container className="my-5">
      <h1 className="text-center mb-4" style={{ color: 'var(--verde-neon)' }}>
        Catálogo de Productos
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <p className="text-center" role="status"><Spinner size="sm" animation="border" className="me-2" />Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-muted">No hay productos disponibles.</p>
      ) : (
        <Row className="g-4">
          {productos.map(prod => (
            <Col key={prod.id} sm={12} md={6} lg={4}>
              <ProductCard producto={prod} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default TiendaView;