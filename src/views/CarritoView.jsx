import { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function CarritoView() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  // Cargar sesión del usuario
  const usuarioSesion = JSON.parse(sessionStorage.getItem('usuarioSesion') || 'null');
  const tieneDescuentoDuoc = usuarioSesion?.descuentoDuoc || false;

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(carritoGuardado);
  }, []);

  function actualizarStorage(nuevoCarrito) {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  }

  function incrementarCantidad(id) {
    const nuevoCarrito = carrito.map(item => 
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    actualizarStorage(nuevoCarrito);
  }

  function decrementarCantidad(id) {
    const nuevoCarrito = carrito.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad - 1;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
      }
      return item;
    }).filter(Boolean); // Elimina si la cantidad llega a 0

    actualizarStorage(nuevoCarrito);
  }

  function eliminarProducto(id) {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    actualizarStorage(nuevoCarrito);
  }

  function vaciarCarrito() {
    actualizarStorage([]);
  }

  // Cálculos de totales
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const descuento = tieneDescuentoDuoc ? subtotal * 0.20 : 0;
  const total = subtotal - descuento;

  return (
    <Container className="my-5">
      <h2 className="mb-4" style={{ color: 'var(--verde-neon)' }}>
        🛒 Carrito de Compras - LEVEL-UP GAMER
      </h2>

      {tieneDescuentoDuoc && (
        <Alert variant="success" className="mb-4">
          🎉 ¡Tienes activado un <strong>20% de descuento Duoc UC</strong> en tu compra!
        </Alert>
      )}

      {carrito.length === 0 ? (
        <Card className="text-center p-5">
          <h4>Tu carrito está vacío</h4>
          <p className="text-muted">Explora nuestras consolas, accesorios y juegos de mesa para empezar a jugar.</p>
          <div>
            <Link to="/" className="btn btn-success mt-3">Ir al Catálogo</Link>
          </div>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <Table responsive borderless className="align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={item.imagen} 
                          alt={item.nombre} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                        <div>
                          <strong>{item.nombre}</strong>
                          <br />
                          <small className="text-muted">Cod: {item.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => decrementarCantidad(item.id)}
                        >
                          -
                        </Button>
                        <span className="fw-bold px-2">{item.cantidad}</span>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => incrementarCantidad(item.id)}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="fw-bold">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => eliminarProducto(item.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-warning" size="sm" onClick={vaciarCarrito}>
              Vaciar Carrito
            </Button>
          </Col>

          <Col lg={4} className="mt-4 mt-lg-0">
            <Card className="p-4 border-primary">
              <h4 className="mb-3" style={{ color: 'var(--azul-electrico)' }}>Resumen de Compra</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>

              {tieneDescuentoDuoc && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento Duoc (20%):</span>
                  <span>-${descuento.toLocaleString('es-CL')}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                <span>Total:</span>
                <span style={{ color: 'var(--verde-neon)' }}>${total.toLocaleString('es-CL')}</span>
              </div>

              <Button 
                variant="success" 
                size="lg" 
                className="w-100 fw-bold" 
                onClick={() => navigate('/checkout')}
              >
                PROCEDER AL PAGO
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CarritoView;