import { useState } from 'react';
import { Alert, Button, Container, Form, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { hasAdminRole, hasSellerRole } from '../api/authService';
import { getApiErrorMessage } from '../api/productService';
import { useAuth } from '../auth/useAuth';

function LoginView() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(event) {
    event.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Ingresa un correo válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      const usuario = await signIn({ email, password });
      navigate(hasAdminRole(usuario) ? '/admin/productos' : hasSellerRole(usuario) ? '/vendedor/productos' : '/');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No fue posible iniciar sesión.'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: '500px' }}>
      <Card className="shadow-sm p-4">
        <h2 className="mb-3 text-center">Iniciar Sesión</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={iniciarSesion}>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mt-2" disabled={cargando}>
            {cargando && <Spinner size="sm" animation="border" className="me-2" />}
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default LoginView;