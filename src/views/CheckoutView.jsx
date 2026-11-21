import { useState } from 'react';
import { Alert, Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderService';
import { getApiErrorMessage } from '../api/productService';
import { useAuth } from '../auth/useAuth';

function CheckoutView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [carrito] = useState(() => JSON.parse(localStorage.getItem('carrito') || '[]'));
  const [datos, setDatos] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    direccion: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function realizarPago(e) {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      const boleta = await createOrder({
        nombreEntrega: datos.nombre,
        correoEntrega: datos.email,
        direccion: datos.direccion,
        productos: carrito.map((producto) => ({
          productoId: String(producto.id),
          cantidad: producto.cantidad,
        })),
      });
      localStorage.removeItem('carrito');
      navigate('/pago-exitoso', { state: { boleta } });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No fue posible registrar la compra.'));
    } finally {
      setGuardando(false);
    }
  }

  if (!user || !['CLIENTE', 'ADMIN'].includes(String(user.rol).toUpperCase())) {
    return (
      <Container className="py-4" style={{ maxWidth: '600px' }}>
        <Alert variant="warning">
          Inicia sesión con una cuenta de cliente para confirmar la compra.
          <div className="mt-2">
            <Button variant="primary" onClick={() => navigate('/login')}>Iniciar sesión</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-2" style={{ maxWidth: '600px' }}>
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Información de Entrega</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {carrito.length === 0 && (
          <Alert variant="warning">El carrito está vacío. Agrega productos antes de confirmar.</Alert>
        )}
        <Form onSubmit={realizarPago}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              required
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              required
              value={datos.email}
              onChange={(e) => setDatos({ ...datos, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dirección de Envío</Form.Label>
            <Form.Control
              required
              value={datos.direccion}
              onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
            />
          </Form.Group>
          <Button type="submit" variant="success" className="w-100 btn-lg mt-3" disabled={guardando || carrito.length === 0}>
            {guardando ? 'Guardando compra...' : 'Confirmar compra'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default CheckoutView;