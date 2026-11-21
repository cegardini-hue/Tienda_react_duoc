import { httpClient } from './httpClient';

export async function createOrder(order) {
  const { data } = await httpClient.post('/v1/boletas', order);
  return data;
}

export async function getOrders(signal) {
  const { data } = await httpClient.get('/v1/boletas', { signal });
  if (!Array.isArray(data)) {
    throw new Error('La respuesta del servidor no contiene una lista de boletas válida.');
  }
  return data;
}

export async function getOrder(id, signal) {
  const { data } = await httpClient.get(`/v1/boletas/${encodeURIComponent(id)}`, { signal });
  return data;
}
