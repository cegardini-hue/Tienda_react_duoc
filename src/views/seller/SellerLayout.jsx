import { Alert, Col, Container, Nav, Row } from 'react-bootstrap';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { hasSellerRole } from '../../api/authService';
import { useAuth } from '../../auth/useAuth';

function SellerLayout() {
  const { user } = useAuth();

  if (!hasSellerRole(user)) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="text-center">
          <h4>Acceso restringido</h4>
          <p>Debes iniciar sesión con una cuenta de vendedor para acceder a esta sección.</p>
          <Alert.Link as={Link} to="/login">Ir al inicio de sesión</Alert.Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-2">
      <Row>
        <Col md={3} lg={2}>
          <div className="bg-dark text-white p-3 rounded mb-4">
            <h4 className="mb-3">Panel Vendedor</h4>
            <Nav className="flex-column">
              <Nav.Link as={NavLink} to="/vendedor/productos" className="text-white">
                Productos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/vendedor/boletas" className="text-white">
                Boletas
              </Nav.Link>
            </Nav>
          </div>
        </Col>
        <Col md={9} lg={10}>
          <div className="bg-white p-4 rounded shadow-sm border">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SellerLayout;
