import { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Badge, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { getApiErrorMessage, getProduct } from '../api/productService';

function DetalleProductoView() {
  const { id } = useParams();
  const [resultado, setResultado] = useState({ id: null, producto: null, error: '' });
  const cargando = resultado.id !== id;
  const producto = cargando ? null : resultado.producto;
  const error = cargando ? '' : resultado.error;

  useEffect(() => {
    const controller = new AbortController();
    getProduct(id, controller.signal)
      .then((data) => setResultado({ id, producto: data, error: '' }))
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setResultado({
          id,
          producto: null,
          error: requestError.response?.status === 404
            ? 'No se encontró el producto solicitado.'
            : getApiErrorMessage(requestError, 'No fue posible cargar el producto.'),
        });
      });
    return () => controller.abort();
  }, [id]);

  if (cargando) {
    return <Container className="py-5 text-center" role="status"><Spinner animation="border" className="me-2" />Cargando producto...</Container>;
  }

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error || 'No se encontró el producto solicitado.'}</Alert>
        <Button as={Link} to="/" variant="primary" className="mt-3">
          Volver a la tienda
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm mx-auto" style={{ maxWidth: '750px' }}>
        <Card.Img
          variant="top"
          src={producto.imagen}
          alt={producto.nombre}
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title as="h2" className="mb-0">{producto.nombre}</Card.Title>
            <Badge bg="info">{producto.categoria}</Badge>
          </div>
          <Card.Text className="text-muted mt-3 fs-5">
            {producto.descripcion}
          </Card.Text>
          <Card.Text className="fs-3 fw-bold text-success my-3">
            {Number(producto.precio) === 0 ? 'GRATIS' : `$${Number(producto.precio).toLocaleString('es-CL')}`}
          </Card.Text>
          <div className="d-flex gap-2">
            <Button as={Link} to="/" variant="secondary">
              Volver al catálogo
            </Button>
            <Button variant="success" onClick={() => alert('¡Producto añadido al carrito!')}>
              Añadir al Carrito
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DetalleProductoView;