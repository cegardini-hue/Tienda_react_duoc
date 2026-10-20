import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ProductCard from '../data/ProductCard';

function CategoriasView() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductos(datos);
  }, []);

  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))];

  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <Container className="py-2">
      <h1 className="mb-4 text-center">Categorías de Productos</h1>
      
      {/* Botones de filtro de categorías */}
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
        {productosFiltrados.map((prod) => (
          <Col sm={12} md={6} lg={3} key={prod.id}>
            <ProductCard producto={prod} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CategoriasView;