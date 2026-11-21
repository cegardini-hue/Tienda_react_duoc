import { httpClient } from './httpClient';

export async function getProducts(signal) {
  const { data } = await httpClient.get('/v1/productos', { signal });
  if (!Array.isArray(data)) {
    throw new Error('La respuesta del servidor no contiene una lista de productos válida.');
  }
  return data;
}

export async function getProduct(id, signal) {
  const { data } = await httpClient.get(`/v1/productos/${encodeURIComponent(id)}`, { signal });
  return data;
}

export async function createProduct(product) {
  const { data } = await httpClient.post('/v1/productos', product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await httpClient.put(`/v1/productos/${encodeURIComponent(id)}`, product);
  return data;
}

export async function deleteProduct(id) {
  await httpClient.delete(`/v1/productos/${encodeURIComponent(id)}`);
}

export function getApiErrorMessage(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || error.message || fallback;
}
