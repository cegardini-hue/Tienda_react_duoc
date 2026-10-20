import { useEffect, useState } from 'react';
import { Button, Card, Container, Badge } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

function DetalleProductoView() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const encontrado = productos.find((item) => item.id === Number(id));
    setProducto(encontrado);
  }, [id]);

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h2>Producto no encontrado</h2>
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
            {producto.precio === 0 ? 'GRATIS' : `$${producto.precio.toLocaleString('es-CL')}`}
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