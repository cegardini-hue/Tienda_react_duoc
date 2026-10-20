import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

function NavbarTienda() {
  const navigate = useNavigate();
  const usuarioSesion = JSON.parse(sessionStorage.getItem('usuarioSesion') || 'null');

  function cerrarSesion() {
    sessionStorage.removeItem('usuarioSesion');
    navigate('/login');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Mi Tienda Online
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/categorias">Categorías</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/carrito" className="btn btn-success text-white me-2 px-3">
              🛒 Carrito
            </Nav.Link>
            
            {usuarioSesion ? (
              <>
                <span className="text-light me-3">
                  Hola, <strong>{usuarioSesion.nombre}</strong>
                </span>
                {usuarioSesion.rol === 'admin' && (
                  <Nav.Link as={NavLink} to="/admin/productos" className="text-warning me-2">
                    Panel Admin
                  </Nav.Link>
                )}
                <Button variant="outline-danger" size="sm" onClick={cerrarSesion}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Crear Cuenta</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarTienda;