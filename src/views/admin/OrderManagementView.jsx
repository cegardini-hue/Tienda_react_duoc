import { useEffect, useState } from 'react';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';
import { getApiErrorMessage } from '../../api/productService';
import { getOrder, getOrders } from '../../api/orderService';

const moneda = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

function OrderManagementView() {
  const [boletas, setBoletas] = useState([]);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getOrders(controller.signal)
      .then(setBoletas)
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'No fue posible cargar las boletas.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, []);

  async function verDetalle(id) {
    setCargandoDetalle(true);
    setError('');
    try {
      setBoletaSeleccionada(await getOrder(id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No fue posible cargar el detalle de la boleta.'));
    } finally {
      setCargandoDetalle(false);
    }
  }

  return (
    <>
      <h2 className="mb-4">Boletas y compras</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <p role="status"><Spinner size="sm" animation="border" className="me-2" />Cargando boletas...</p>
      ) : boletas.length === 0 ? (
        <p className="text-muted">Todavía no hay compras registradas.</p>
      ) : (
        <Table responsive bordered hover>
          <thead className="table-dark">
            <tr>
              <th>N.º</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map((boleta) => (
              <tr key={boleta.id}>
                <td>{boleta.id}</td>
                <td>{new Date(boleta.fechaCreacion).toLocaleString('es-CL')}</td>
                <td>{boleta.clienteEmail}</td>
                <td>{boleta.estado}</td>
                <td>{moneda(boleta.total)}</td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => verDetalle(boleta.id)}>
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {cargandoDetalle && <p role="status">Cargando detalle...</p>}
      {boletaSeleccionada && (
        <section className="border rounded p-3 mt-4" aria-label="Detalle de boleta">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="h5">Boleta #{boletaSeleccionada.id}</h3>
            <Button size="sm" variant="outline-secondary" onClick={() => setBoletaSeleccionada(null)}>
              Cerrar
            </Button>
          </div>
          <p className="mb-1">Entrega: {boletaSeleccionada.nombreEntrega} · {boletaSeleccionada.direccion}</p>
          <p>Correo: {boletaSeleccionada.correoEntrega}</p>
          <Table size="sm" responsive>
            <thead>
              <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr>
            </thead>
            <tbody>
              {boletaSeleccionada.detalles.map((detalle, index) => (
                <tr key={`${boletaSeleccionada.id}-${index}`}>
                  <td>{detalle.nombreProducto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{moneda(detalle.precioUnitario)}</td>
                  <td>{moneda(detalle.totalLinea)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="text-end mb-1">Subtotal: {moneda(boletaSeleccionada.subtotal)}</p>
          <p className="text-end mb-1">Descuento: {moneda(boletaSeleccionada.descuento)}</p>
          <p className="text-end fw-bold">Total: {moneda(boletaSeleccionada.total)}</p>
        </section>
      )}
    </>
  );
}

export default OrderManagementView;
