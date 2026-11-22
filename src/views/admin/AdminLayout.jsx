import { Alert, Col, Container, Row } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { hasAdminRole } from '../../api/authService';
import { useAuth } from '../../auth/useAuth';

function AdminLayout() {
  const { user: usuario } = useAuth();

  if (!hasAdminRole(usuario)) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="text-center">
          <h4>Acceso Restringido</h4>
          <p>Debes iniciar sesión con una cuenta de administrador para acceder a esta sección.</p>
          <Alert.Link as={Link} to="/login">
            Ir al inicio de sesión
          </Alert.Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-2">
      <Row>
        <Col md={3} lg={2}>
          <AdminSidebar />
        </Col>
        <Col md={9} lg={10}>
          <div className="bg-white text-dark p-4 rounded shadow-sm border">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminLayout;