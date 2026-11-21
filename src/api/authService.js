import { httpClient } from './httpClient';

function decodeTokenClaims(token) {
  const payload = token.split('.')[1];
  if (!payload) return {};

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  const bytes = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function normalizeRoles(...values) {
  return values.flatMap((value) => {
    if (Array.isArray(value)) {
      return normalizeRoles(...value);
    }
    if (typeof value === 'string') {
      return value.split(/[,\s]+/).filter(Boolean);
    }
    if (value && typeof value === 'object') {
      return normalizeRoles(value.authority, value.role, value.name);
    }
    return [];
  });
}

export function hasAdminRole(user) {
  return normalizeRoles(user?.rol, user?.role, user?.roles, user?.authorities)
    .some((role) => role.replace(/^ROLE_/, '').toLowerCase() === 'admin');
}

export function hasSellerRole(user) {
  return normalizeRoles(user?.rol, user?.role, user?.roles, user?.authorities)
    .some((role) => role.replace(/^ROLE_/, '').toLowerCase() === 'vendedor');
}

export async function login(credentials) {
  const { data } = await httpClient.post('/v1/auth/login', credentials);
  const { accessToken, tokenType = 'Bearer', expiresIn } = data;

  if (!accessToken || !Number.isFinite(Number(expiresIn)) || Number(expiresIn) <= 0) {
    throw new Error('La respuesta de autenticación no contiene un token o expiración válida.');
  }

  const claims = decodeTokenClaims(accessToken);
  const user = data.usuario || data.user || data;
  const roles = normalizeRoles(
    user.rol,
    user.role,
    user.roles,
    user.authorities,
    claims.rol,
    claims.role,
    claims.roles,
    claims.authorities
  );
  const activeRole = roles.find((role) =>
    ['admin', 'vendedor', 'cliente'].includes(role.replace(/^ROLE_/, '').toLowerCase())
  );

  return {
    accessToken,
    tokenType,
    expiresAt: Date.now() + Number(expiresIn) * 1000,
    user: {
      nombre: user.nombre || user.name || claims.nombre || claims.name || claims.sub || '',
      email: user.email || claims.email || '',
      rol: activeRole || roles[0] || 'cliente',
      descuentoDuoc: user.descuentoDuoc || false,
    },
  };
}

export async function register(credentials) {
  const { data } = await httpClient.post('/v1/auth/register', credentials);
  return data;
}
