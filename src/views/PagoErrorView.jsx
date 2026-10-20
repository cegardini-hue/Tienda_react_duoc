import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PagoErrorView() {
  return (
    <Container className="py-5 text-center" style={{ maxWidth: '600px' }}>
      <Alert variant="danger" className="p-4">
        <h2>❌ No se pudo realizar el pago</h2>
        <p className="mt-3">Ocurrió un inconveniente con la transacción. Por favor, reintenta nuevamente.</p>
        <Button as={Link} to="/checkout" variant="warning" className="mt-2">
          Volver a Intentar
        </Button>
      </Alert>
    </Container>
  );
}

export default PagoErrorView;