import { useEffect, useState } from 'react';
import { Alert, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { getApiErrorMessage, getProducts } from '../api/productService';

function CategoriasView() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
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

  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))];

  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <Container className="py-2">
      <h1 className="mb-4 text-center">Categorías de Productos</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <p className="text-center" role="status"><Spinner size="sm" animation="border" className="me-2" />Cargando productos...</p>
      ) : (
      <>
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {categorias.map((cat) => (
          <Button
            key={cat}
            variant={categoriaSeleccionada === cat ? 'primary' : 'outline-primary'}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <Row className="g-4">
        {productosFiltrados.length === 0 && <p className="text-center text-muted">No hay productos disponibles.</p>}
        {productosFiltrados.map((prod) => (
          <Col sm={12} md={6} lg={3} key={prod.id}>
            <ProductCard producto={prod} />
          </Col>
        ))}
      </Row>
      </>
      )}
    </Container>
  );
}

export default CategoriasView;