import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminAgregarProductoView() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    descripcion: '',
    imagen: ''
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  function manejarCambio(e) {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  }

  function esUrlValida(valor) {
    try {
      new URL(valor);
      return true;
    } catch {
      return false;
    }
  }

  function validar() {
    const nuevosErrores = {};
    if (producto.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa un nombre válido (mín. 3 caracteres)';
    }
    if (producto.precio === '' || Number(producto.precio) < 0) {
      nuevosErrores.precio = 'Ingresa un precio mayor o igual a 0';
    }
    if (producto.categoria.trim() === '') {
      nuevosErrores.categoria = 'La categoría es requerida';
    }
    if (producto.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    if (!esUrlValida(producto.imagen)) {
      nuevosErrores.imagen = 'Ingresa una URL de imagen válida';
    }
    return nuevosErrores;
  }

  function guardarProducto(e) {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setMensaje('');

    if (Object.keys(nuevosErrores).length > 0) return;

    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const nuevoProducto = {
      id: Date.now(),
      nombre: producto.nombre,
      precio: Number(producto.precio),
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      imagen: producto.imagen
    };

    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));
    setMensaje('¡Producto agregado correctamente!');

    setTimeout(() => {
      navigate('/admin/productos');
    }, 800);
  }

  return (
    <>
      <h2 className="mb-4">Agregar Nuevo Producto</h2>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      <Form onSubmit={guardarProducto}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            name="nombre"
            value={producto.nombre}
            onChange={manejarCambio}
            isInvalid={!!errores.nombre}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio ($)</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={producto.precio}
            onChange={manejarCambio}
            isInvalid={!!errores.precio}
          />
          <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            name="categoria"
            value={producto.categoria}
            onChange={manejarCambio}
            isInvalid={!!errores.categoria}
          />
          <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={producto.descripcion}
            onChange={manejarCambio}
            isInvalid={!!errores.descripcion}
          />
          <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL de la Imagen</Form.Label>
          <Form.Control
            name="imagen"
            value={producto.imagen}
            onChange={manejarCambio}
            placeholder="https://picsum.photos/600/400"
            isInvalid={!!errores.imagen}
          />
          <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">
          Guardar Producto
        </Button>
      </Form>
    </>
  );
}

export default AdminAgregarProductoView;