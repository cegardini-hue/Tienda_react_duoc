import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function PagoExitosoView() {
  const { state } = useLocation();
  const boleta = state?.boleta;

  return (
    <Container className="py-5 text-center" style={{ maxWidth: '600px' }}>
      <Alert variant="success" className="p-4">
        <h2>¡Compra registrada!</h2>
        <p className="mt-3">
          {boleta
            ? <>Tu boleta <strong>#{boleta.id}</strong> fue confirmada por ${Number(boleta.total).toLocaleString('es-CL')}.</>
            : 'La compra fue registrada. Puedes continuar navegando en la tienda.'}
        </p>
        <p className="text-muted">Este proyecto registra la compra, pero no procesa pagos reales.</p>
        <Button as={Link} to="/" variant="success" className="mt-2">
          Volver a la Tienda
        </Button>
      </Alert>
    </Container>
  );
}

export default PagoExitosoView;