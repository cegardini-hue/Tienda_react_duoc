import { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function CarritoView() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    // Para demostración cargamos los productos como ejemplo del carrito
    const datos = JSON.parse(localStorage.getItem('productos') || '[]');
    setCarrito(datos);
  }, []);

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  return (
    <Container className="py-2">
      <h1 className="mb-4">Carrito de Compras</h1>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <Row>
          <Col md={8}>
            <Table responsive bordered hover align="middle">
              <thead className="table-dark">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imagen} alt={item.nombre} style={{ width: '50px', height: '35px', objectFit: 'cover' }} />
                    </td>
                    <td>{item.nombre}</td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={4}>
            <Card className="p-3 shadow-sm">
              <h4>Resumen del Pedido</h4>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                <span>Total:</span>
                <span className="text-success">${total.toLocaleString('es-CL')}</span>
              </div>
              <Button variant="success" className="w-100" onClick={() => navigate('/checkout')}>
                Comprar ahora
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CarritoView;