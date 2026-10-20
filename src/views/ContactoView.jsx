import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

function ContactoView() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('Soporte Técnico');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !email || !mensaje) return;

    // Simulación de envío
    setEnviado(true);
    setNombre('');
    setEmail('');
    setMensaje('');

    setTimeout(() => {
      setEnviado(false);
    }, 4000);
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: 'var(--verde-neon)' }}>
        CONTACTO Y SERVICIO TÉCNICO
      </h2>
      <p className="text-center text-muted mb-5">
        ¿Tienes dudas con tu pedido o necesitas servicio técnico especializado para tu equipo gamer? ¡Escríbenos!
      </p>

      <Row className="g-4">
        {/* Formulario de Contacto y Soporte */}
        <Col lg={7}>
          <Card className="p-4 shadow">
            <h4 className="mb-4" style={{ color: 'var(--azul-electrico)' }}>
              Envíanos un Mensaje
            </h4>

            {enviado && (
              <Alert variant="success">
                ¡Gracias por contactar a <strong>Level-Up Gamer</strong>! Te responderemos a la brevedad.
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Tu nombre" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="tu.correo@ejemplo.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Consulta</Form.Label>
                <Form.Select value={asunto} onChange={e => setAsunto(e.target.value)}>
                  <option value="Soporte Técnico">Servicio Técnico y Mantenimiento PC</option>
                  <option value="Ventas">Consultas sobre Productos o Stock</option>
                  <option value="Descuento Duoc">Validación de Descuento Duoc UC</option>
                  <option value="Garantia">Garantías y Devoluciones</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  placeholder="Detalla tu consulta o las especificaciones de tu equipo..." 
                  value={mensaje} 
                  onChange={e => setMensaje(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100 py-2 fw-bold">
                ENVIAR CONSULTA
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Panel Lateral: WhatsApp Directo e Info */}
        <Col lg={5}>
          <Card className="p-4 mb-4 border-success">
            <h4 className="mb-3" style={{ color: 'var(--verde-neon)' }}>
              💬 Soporte Directo WhatsApp
            </h4>
            <p className="text-muted">
              ¿Necesitas respuesta inmediata de nuestro Servicio Técnico? Chatea directamente con un especialista vía WhatsApp.
            </p>
            <a 
              href="https://wa.me/56912345678?text=Hola%20Level-Up%20Gamer,%20necesito%20soporte%20tecnico" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-success py-2 fw-bold w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <span>CHATEAR EN WHATSAPP</span>
            </a>
          </Card>

          <Card className="p-4">
            <h5 className="mb-3" style={{ color: 'var(--azul-electrico)' }}>
              📍 Cobertura y Atención
            </h5>
            <ul className="list-unstyled text-muted mb-0">
              <li className="mb-2">🚚 <strong>Envíos:</strong> Despacho a todo Chile.</li>
              <li className="mb-2">⏰ <strong>Horario de Soporte:</strong> Lunes a Viernes de 09:00 a 19:00 hrs.</li>
              <li className="mb-2">📧 <strong>Correo Oficial:</strong> soporte@levelupgamer.cl</li>
              <li>🎮 <strong>Comunidad:</strong> Eventos y torneos nacionales.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactoView;