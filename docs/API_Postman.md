# API y pruebas con Postman

## Direcciones base

- EC2 con Nginx: `http://IP_PUBLICA_EC2/api`
- Túnel SSH desde el equipo local: `http://localhost:8081/api`
- API local sin túnel: `http://127.0.0.1:8080/api`

No uses `:8080` desde Internet: Spring enlaza a `127.0.0.1` y Nginx es el punto de entrada público. Swagger está en `http://IP_PUBLICA_EC2/swagger-ui/index.html` o `http://127.0.0.1:8080/swagger-ui/index.html`.

Importa `Tienda_Postman_Collection.json` en Postman. Define la variable de colección `baseUrl` con una de las direcciones anteriores. La contraseña del administrador no forma parte del repositorio ni se puede recuperar desde el hash guardado en H2.

## Obtener token

Envía `POST {{baseUrl}}/v1/auth/login` con:

```json
{
  "email": "{{adminEmail}}",
  "password": "{{adminPassword}}"
}
```

Usa los valores de la cuenta administradora ya creada en EC2. El correo corresponde a `ADMIN_EMAIL`; la clave es la que se configuró la primera vez en `ADMIN_INITIAL_PASSWORD`. Cambiar esa variable después no actualiza la contraseña de un usuario existente. La colección guarda automáticamente `accessToken` si el login resulta exitoso.

En Postman selecciona **Authorization → Bearer Token** y usa `{{accessToken}}` para las llamadas protegidas.

## Endpoints

| Método | Ruta | Acceso | Propósito |
|---|---|---|---|
| `POST` | `/v1/auth/register` | Público | Registrar cliente (`nombre`, `email`, `fechaNacimiento`, `password`). |
| `POST` | `/v1/auth/login` | Público | Iniciar sesión; devuelve `accessToken`, `tokenType`, `expiresIn` y usuario. |
| `GET` | `/v1/productos` | Público | Listar catálogo. |
| `GET` | `/v1/productos/{id}` | Público | Consultar producto. |
| `POST` | `/v1/productos` | ADMIN | Crear producto. |
| `PUT` | `/v1/productos/{id}` | ADMIN | Actualizar producto. |
| `DELETE` | `/v1/productos/{id}` | ADMIN | Eliminar producto. |
| `GET` | `/v1/categorias` | Público | Listar categorías. |
| `POST` | `/v1/boletas` | CLIENTE/ADMIN | Registrar compra. |
| `GET` | `/v1/boletas` | ADMIN/VENDEDOR | Listar compras. |
| `GET` | `/v1/boletas/{id}` | ADMIN/VENDEDOR | Ver boleta y sus detalles. |
| `GET` | `/health` | Público | Comprobar estado del servicio. Ruta completa: `/api/health`. |

### Crear una compra

La sesión debe ser de cliente (o administrador para una prueba). No envíes precios ni descuentos: el backend los calcula desde el catálogo y desde el correo asociado al token.

```json
{
  "nombreEntrega": "Nombre de prueba",
  "correoEntrega": "entrega@ejemplo.cl",
  "direccion": "Av. Ejemplo 123",
  "productos": [
    { "productoId": "JM001", "cantidad": 2 }
  ]
}
```

Respuesta `201 Created`: contiene `id`, subtotal, descuento, total, estado y detalles. El descuento del 20% se aplica únicamente si el usuario autenticado está registrado con correo `@duoc.cl` o `@duocuc.cl`. La respuesta confirma persistencia de la compra, no un pago real.

## Códigos de respuesta frecuentes

- `400`: datos inválidos o cantidad/productos incorrectos.
- `401`: falta un Bearer token válido o las credenciales de login no coinciden.
- `403`: token válido, rol sin permiso.
- `404`: producto o boleta inexistente.
- `409`: conflicto de datos, por ejemplo eliminar un producto asociado a una boleta.

## Credenciales Postman

No es posible deducir la contraseña actual desde el código ni desde la base: se guarda como hash BCrypt. Usa la clave original que configuraste en EC2. Si no la conservas, no cambies `ADMIN_INITIAL_PASSWORD` esperando un reset automático; hay que ejecutar un procedimiento de restablecimiento controlado en el servidor.
