import { useState } from 'react';
import { Alert, Button, Container, Form, Card } from 'react-bootstrap';

function RegistroView() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: ''
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  function manejarCambio(event) {
    const { name, value } = event.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  function validar() {
    const nuevosErrores = {};
    if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa al menos 3 caracteres';
    }
    if (!formulario.email.includes('@')) {
      nuevosErrores.email = 'Ingresa un correo válido';
    }
    if (formulario.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formulario.password !== formulario.confirmar) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }
    return nuevosErrores;
  }

  function registrar(event) {
    event.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setMensaje('');

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.some((usuario) => usuario.email === formulario.email);

    if (existe) {
      setErrores({ email: 'Este correo ya está registrado' });
      return;
    }

    usuarios.push({
      id: Date.now(),
      nombre: formulario.nombre,
      email: formulario.email,
      password: formulario.password,
      rol: 'cliente'
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    setMensaje('¡Usuario registrado correctamente!');
    setFormulario({ nombre: '', email: '', password: '', confirmar: '' });
  }

  return (
    <Container className="py-4" style={{ maxWidth: '550px' }}>
      <Card className="shadow-sm p-4">
        <h2 className="mb-4 text-center">Crear Cuenta</h2>
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        
        <Form onSubmit={registrar}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formulario.email}
              onChange={manejarCambio}
              isInvalid={!!errores.email}
            />
            <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formulario.password}
              onChange={manejarCambio}
              isInvalid={!!errores.password}
            />
            <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmar"
              value={formulario.confirmar}
              onChange={manejarCambio}
              isInvalid={!!errores.confirmar}
            />
            <Form.Control.Feedback type="invalid">{errores.confirmar}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mt-2">
            Registrarme
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default RegistroView;