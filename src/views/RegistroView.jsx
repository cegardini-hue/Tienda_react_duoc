import { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RegistroView() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
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

  function handleRegistro(e) {
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

    const esDuoc = email.toLowerCase().endsWith('@duoc.cl') || email.toLowerCase().endsWith('@duocuc.cl');

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.find(u => u.email === email)) {
      setError('El correo ya se encuentra registrado.');
      return;
    }

    const nuevoUsuario = {
      nombre,
      email,
      fechaNacimiento,
      password,
      rol: 'cliente',
      descuentoDuoc: esDuoc
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    setExito(esDuoc 
      ? '¡Registro exitoso! Se ha activado tu 20% de descuento de por vida por correo Duoc.' 
      : '¡Registro exitoso! Ya puedes iniciar sesión.'
    );

    setTimeout(() => {
      navigate('/login');
    }, 2000);
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
              onChange={e => setPassword(e.target.value)} 
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 py-2">
            CREAR CUENTA
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default RegistroView;