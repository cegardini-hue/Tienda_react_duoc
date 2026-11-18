import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';
import { getApiErrorMessage } from '../api/productService';

function RegistroView() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  function esMayorDeEdad(fecha) {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  }

  async function handleRegistro(e) {
    e.preventDefault();
    setError('');
    setExito('');

    if (!nombre || !email || !fechaNacimiento || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!esMayorDeEdad(fechaNacimiento)) {
      setError('Debes ser mayor de 18 años para registrarte en Level-Up Gamer.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const usuario = await register({ nombre, email, fechaNacimiento, password });
      setExito(usuario.descuentoDuoc
        ? '¡Registro exitoso! Se ha activado tu 20% de descuento por correo Duoc.'
        : '¡Registro exitoso! Ya puedes iniciar sesión.');
      window.setTimeout(() => navigate('/login'), 1500);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No fue posible completar el registro.'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <Container className="my-5" style={{ maxWidth: '500px' }}>
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4" style={{ color: 'var(--verde-neon)' }}>LEVEL-UP GAMER</h2>
        <h4 className="text-center mb-4">Registro de Usuario</h4>

        {error && <Alert variant="danger">{error}</Alert>}
        {exito && <Alert variant="success">{exito}</Alert>}

        <Form onSubmit={handleRegistro}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ej: Juan Pérez" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="tu.correo@duoc.cl (20% dcto)" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <Form.Text className="text-muted">
              Usa tu correo @duoc.cl para obtener un 20% de descuento vitalicio.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control 
              type="date" 
              value={fechaNacimiento} 
              onChange={e => setFechaNacimiento(e.target.value)} 
            />
            <Form.Text className="text-muted">Requisito: Debe ser mayor de 18 años.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              autoComplete="new-password"
              onChange={e => setPassword(e.target.value)} 
            />
            <Form.Text className="text-muted">Debe tener al menos 8 caracteres.</Form.Text>
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 py-2" disabled={cargando}>
            {cargando && <Spinner size="sm" animation="border" className="me-2" />}
            {cargando ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default RegistroView;