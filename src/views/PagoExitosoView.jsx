import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PagoExitosoView() {
  return (
    <Container className="py-5 text-center" style={{ maxWidth: '600px' }}>
      <Alert variant="success" className="p-4">
        <h2>🎉 ¡Pago Realizado con Éxito!</h2>
        <p className="mt-3">Tu orden <strong>#20260810</strong> ha sido procesada correctamente.</p>
        <Button as={Link} to="/" variant="success" className="mt-2">
          Volver a la Tienda
        </Button>
      </Alert>
    </Container>
  );
}

export default PagoExitosoView;