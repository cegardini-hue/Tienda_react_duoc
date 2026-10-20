import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ProductCard({ producto }) {
  function agregarAlCarrito() {
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');
    const index = carritoActual.findIndex(item => item.id === producto.id);

    if (index >= 0) {
      carritoActual[index].cantidad += 1;
    } else {
      carritoActual.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    alert(`¡${producto.nombre} agregado al carrito!`);
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={producto.imagen} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <small className="text-muted">{producto.categoria}</small>
        <Card.Title className="mt-1">{producto.nombre}</Card.Title>
        <Card.Text className="flex-grow-1 text-muted" style={{ fontSize: '0.9rem' }}>
          {producto.descripcion}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold" style={{ color: 'var(--verde-neon)' }}>
            ${producto.precio.toLocaleString('es-CL')}
          </span>
          <div className="d-flex gap-2">
            <Link to={`/producto/${producto.id}`} className="btn btn-outline-primary size-sm">
              Ver
            </Link>
            <Button variant="success" size="sm" onClick={agregarAlCarrito}>
              + Agregar
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;