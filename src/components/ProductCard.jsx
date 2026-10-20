import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ProductCard({ producto }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text className="text-muted mb-2">
          {producto.categoria}
        </Card.Text>
        <Card.Text className="fs-5 fw-bold text-primary mt-auto">
          {producto.precio === 0 ? 'GRATIS' : `$${producto.precio.toLocaleString('es-CL')}`}
        </Card.Text>
        <Button as={Link} to={`/producto/${producto.id}`} variant="outline-primary" className="w-100 mt-2">
          Ver detalle
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;