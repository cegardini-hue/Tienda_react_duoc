import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { productosIniciales } from '../data/productosIniciales';

function TiendaView() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // 1. Intentar obtener productos de localStorage
    const guardados = JSON.parse(localStorage.getItem('productos') || '[]');

    // 2. Si no hay productos en localStorage, cargamos los productos por defecto y los guardamos
    if (guardados.length === 0) {
      localStorage.setItem('productos', JSON.stringify(productosIniciales));
      setProductos(productosIniciales);
    } else {
      setProductos(guardados);
    }
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4" style={{ color: 'var(--verde-neon)' }}>
        Catálogo de Productos
      </h1>

      {productos.length === 0 ? (
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