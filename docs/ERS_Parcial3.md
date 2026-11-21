# Especificación de requisitos — Tienda React Duoc

**Versión:** 3.0
**Estado:** actualizado para la Evaluación Parcial 3
**Base de datos seleccionada:** H2 relacional en archivo local

Este documento reemplaza el alcance desactualizado de `ERS_IEEE830_Tienda_React.docx`, que describía la persistencia anterior en el navegador.

## 1. Propósito y alcance

La aplicación permite explorar un catálogo de productos, administrar productos, registrar clientes, iniciar sesión con JWT y persistir compras como boletas con sus detalles. El frontend React se comunica con una API Spring Boot. La API utiliza H2 en archivo para conservar la información entre reinicios.

La compra se registra como confirmada para fines académicos. No existe una integración real con bancos o pasarelas de pago.

## 2. Actores y permisos

| Actor | Permisos |
|---|---|
| Visitante | Consultar catálogo y categorías; registrarse e iniciar sesión. |
| Cliente | Acceder a la tienda y confirmar compras. El descuento DUOC se calcula en el backend cuando el correo registrado termina en `@duoc.cl` o `@duocuc.cl`. |
| Vendedor | Consultar productos y listar/ver el detalle de boletas. No puede crear, editar ni eliminar productos ni registrar compras. |
| Administrador | Administrar productos, consultar boletas y registrar compras de prueba. |

Las rutas de panel se protegen en el frontend y cada operación se vuelve a autorizar en el backend. El frontend no determina el precio ni el descuento final de una compra.

## 3. Requisitos funcionales

1. La tienda consulta productos y categorías desde la API.
2. Un usuario puede registrarse como cliente y autenticarse con correo y contraseña.
3. La API emite un token JWT tipo Bearer con expiración configurable (900 segundos por defecto).
4. El administrador puede crear, listar, editar y eliminar productos.
5. El cliente autenticado puede confirmar una compra indicando entrega y productos/cantidades.
6. La API valida cada producto y cantidad, obtiene los precios del catálogo, calcula subtotal, descuento y total, y persiste la boleta y sus detalles.
7. El administrador y el vendedor pueden consultar boletas y ver sus detalles.
8. El vendedor dispone de una vista de productos de solo lectura y no ve controles de administración.
9. Los errores de validación, autenticación, permisos y recursos inexistentes se entregan con códigos HTTP y mensaje JSON.
10. La API publica su contrato OpenAPI/Swagger y mantiene rutas anteriores de autenticación y productos por compatibilidad.

## 4. Modelo de datos

```text
USUARIO (1) ─── (N) BOLETA (1) ─── (N) DETALLE_BOLETA (N) ─── (1) PRODUCTO (N) ─── (1) CATEGORIA
```

- **USUARIO:** correo único, nombre, hash BCrypt de contraseña, fecha de nacimiento opcional para cuentas de operación y rol.
- **CATEGORIA:** identificador y nombre único.
- **PRODUCTO:** identificador, nombre, precio, descripción, imagen y relación con categoría.
- **BOLETA:** usuario cliente, datos de entrega, fecha, subtotal, descuento, total y estado.
- **DETALLE_BOLETA:** boleta, producto, nombre y precio unitario al momento de compra, cantidad y total de línea.

Los importes y detalles históricos se generan en el servidor a partir de los precios vigentes al crear la boleta. Los datos se guardan en H2 y no se sincronizan con Git.

## 5. Requisitos no funcionales

- Contraseñas almacenadas con BCrypt; JWT firmado y expiración configurable.
- Servicio Spring Boot enlazado a `127.0.0.1` por defecto; en EC2 el acceso externo se canaliza por Nginx.
- La API está versionada bajo `/api/v1`; Swagger UI se publica en `/swagger-ui/index.html`.
- H2 en archivo es para demostración/instancia pequeña. Cambiar a una base administrada requiere migración y copias de seguridad planificadas.
- Las credenciales y secretos se entregan mediante variables de entorno fuera del repositorio.

## 6. Criterios de aceptación

- Un visitante puede consultar el catálogo sin token y una ruta de producto inexistente devuelve `404`.
- Una cuenta registrada puede iniciar sesión y recibir un JWT con `expiresIn`.
- Un cliente DUOC compra un producto y recibe una boleta cuyo descuento y total fueron calculados por el backend.
- Un vendedor puede listar y consultar boletas, pero recibe `403` al intentar modificar productos.
- Un administrador puede completar el CRUD de productos.
- Los datos persisten tras reiniciar Spring Boot; el build frontend y las pruebas de integración backend terminan correctamente.

## 7. Fuera de alcance

Pagos reales, facturación tributaria, control de stock, cancelación/devolución de pedidos, HTTPS con dominio y alta disponibilidad. La configuración de Nginx incluye proxy API y fallback SPA, pero certificados TLS dependen de contar con un dominio.
