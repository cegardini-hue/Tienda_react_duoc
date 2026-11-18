import { httpClient } from './httpClient';

export async function getProducts(signal) {
  const { data } = await httpClient.get('/productos', { signal });
  if (!Array.isArray(data)) {
    throw new Error('La respuesta del servidor no contiene una lista de productos válida.');
  }
  return data;
}

export async function getProduct(id, signal) {
  const { data } = await httpClient.get(`/productos/${encodeURIComponent(id)}`, { signal });
  return data;
}

export async function createProduct(product) {
  const { data } = await httpClient.post('/productos', product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await httpClient.put(`/productos/${encodeURIComponent(id)}`, product);
  return data;
}

export async function deleteProduct(id) {
  await httpClient.delete(`/productos/${encodeURIComponent(id)}`);
}

export function getApiErrorMessage(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || error.message || fallback;
}
