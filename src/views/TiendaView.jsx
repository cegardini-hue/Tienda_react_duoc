import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ProductCard from '../data/ProductCard';

function TiendaView() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductos(datos);
  }, []);

  return (
    <Container className="py-2">
      <h1 className="mb-4 text-center">Catálogo de Productos</h1>
      <Row className="g-4">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <Col sm={12} md={6} lg={3} key={producto.id}>
              <ProductCard producto={producto} />
            </Col>
          ))
        ) : (
          <p className="text-center fs-5">No hay productos disponibles.</p>
        )}
      </Row>
    </Container>
  );
}

export default TiendaView;


