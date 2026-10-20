import { useState } from 'react';
import { Alert, Button, Container, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function iniciarSesion(event) {
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

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioRegistrado = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    const esAdmin = email === 'admin@tienda.cl' && password === '123456';

    if (!usuarioRegistrado && !esAdmin) {
      setError('Correo o contraseña incorrectos');
      return;
    }

    const usuarioSesion = esAdmin
      ? { nombre: 'Administrador', email: 'admin@tienda.cl', rol: 'admin' }
      : usuarioRegistrado;

    sessionStorage.setItem('usuarioSesion', JSON.stringify(usuarioSesion));

    if (usuarioSesion.rol === 'admin') {
      navigate('/admin/productos');
    } else {
      navigate('/');
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: '500px' }}>
      <Card className="shadow-sm p-4">
        <h2 className="mb-3 text-center">Iniciar Sesión</h2>
        <Alert variant="info" className="small">
          <strong>Administrador de prueba:</strong><br />
          Email: <code>admin@tienda.cl</code> | Pass: <code>123456</code>
        </Alert>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={iniciarSesion}>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mt-2">
            Iniciar Sesión
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default LoginView;