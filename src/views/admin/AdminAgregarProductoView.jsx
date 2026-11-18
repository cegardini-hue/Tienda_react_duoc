import { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getApiErrorMessage, getProduct, updateProduct } from '../../api/productService';

const productoVacio = {
  nombre: '',
  precio: '',
  categoria: '',
  descripcion: '',
  imagen: '',
};

function AdminAgregarProductoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [producto, setProducto] = useState(productoVacio);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [productoCargadoId, setProductoCargadoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const cargando = editando && productoCargadoId !== id;

  useEffect(() => {
    if (!editando) return undefined;

    const controller = new AbortController();

    getProduct(id, controller.signal)
      .then((data) => {
        setProducto({
          nombre: data.nombre ?? '',
          precio: data.precio ?? '',
          categoria: data.categoria ?? '',
          descripcion: data.descripcion ?? '',
          imagen: data.imagen ?? '',
        });
        setError('');
        setProductoCargadoId(id);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        if (requestError.response?.status === 404) {
          setError('No se encontró un producto con ese ID.');
        } else {
          setError(getApiErrorMessage(requestError, 'No fue posible cargar el producto.'));
        }
        setProductoCargadoId(id);
      });

    return () => controller.abort();
  }, [editando, id]);

  function manejarCambio(event) {
    const { name, value } = event.target;
    setProducto((actual) => ({ ...actual, [name]: value }));
  }

  function validar() {
    const nuevosErrores = {};
    if (producto.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa un nombre válido (mín. 3 caracteres)';
    }
    if (producto.precio === '' || !Number.isFinite(Number(producto.precio)) || Number(producto.precio) < 0) {
      nuevosErrores.precio = 'Ingresa un precio mayor o igual a 0';
    }
    if (!producto.categoria.trim()) {
      nuevosErrores.categoria = 'La categoría es requerida';
    }
    if (producto.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    try {
      new URL(producto.imagen);
    } catch {
      nuevosErrores.imagen = 'Ingresa una URL de imagen válida';
    }

    return nuevosErrores;
  }

  async function guardarProducto(event) {
    event.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setError('');

    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    const productoPayload = {
      nombre: producto.nombre.trim(),
      precio: Number(producto.precio),
      categoria: producto.categoria.trim(),
      descripcion: producto.descripcion.trim(),
      imagen: producto.imagen.trim(),
    };

    try {
      if (editando) {
        await updateProduct(id, productoPayload);
      } else {
        await createProduct(productoPayload);
      }
      navigate('/admin/productos');
    } catch (requestError) {
      if (editando && requestError.response?.status === 404) {
        setError('No se encontró un producto con ese ID.');
      } else {
        setError(getApiErrorMessage(requestError, 'No fue posible guardar el producto.'));
      }
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p role="status"><Spinner size="sm" animation="border" className="me-2" />Cargando producto...</p>;
  }

  return (
    <>
      <h2 className="mb-4">{editando ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {!(editando && error) && (
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
              min="0"
              step="1"
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

          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando && <Spinner size="sm" animation="border" className="me-2" />}
            {guardando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Guardar Producto'}
          </Button>
        </Form>
      )}
    </>
  );
}

export default AdminAgregarProductoView;
