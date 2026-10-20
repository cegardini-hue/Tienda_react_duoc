import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CheckoutView() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ nombre: '', email: '', direccion: '', region: 'Región Metropolitana' });

  function realizarPago(e) {
    e.preventDefault();
    // Simulación de respuesta de pasarela de pago
    const exito = Math.random() > 0.3; // 70% de éxito
    if (exito) {
      navigate('/pago-exitoso');
    } else {
      navigate('/pago-error');
    }
  }

  return (
    <Container className="py-2" style={{ maxWidth: '600px' }}>
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Información de Entrega</h2>
        <Form onSubmit={realizarPago}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control required onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control type="email" required onChange={(e) => setDatos({ ...datos, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dirección de Envío</Form.Label>
            <Form.Control required onChange={(e) => setDatos({ ...datos, direccion: e.target.value })} />
          </Form.Group>
          <Button type="submit" variant="success" className="w-100 btn-lg mt-3">
            Pagar Ahora
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default CheckoutView;