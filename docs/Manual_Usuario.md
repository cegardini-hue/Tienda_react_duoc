# Manual de usuario

## Cliente

1. Abre la tienda y revisa el catálogo o filtra por categoría.
2. Agrega productos al carrito y ajusta sus cantidades.
3. Regístrate con nombre, correo, fecha de nacimiento y contraseña; luego inicia sesión.
4. En el carrito selecciona **Proceder al pago**. Completa los datos de entrega y confirma la compra.
5. La pantalla de confirmación muestra el número de boleta y el total registrado. Esta entrega académica no procesa pagos reales.
6. El descuento DUOC se concede a cuentas cuyo correo termina en `@duoc.cl` o `@duocuc.cl`; el backend vuelve a calcularlo al registrar la compra.

## Administrador

1. Inicia sesión con la cuenta configurada en EC2.
2. En **Panel Admin**, usa **Listar Productos** para consultar, editar o eliminar y **Agregar Producto** para crear.
3. Usa **Boletas** para consultar compras y abrir sus detalles.
4. Para probar endpoints directamente, sigue [API/Postman](./API_Postman.md).

## Vendedor

1. El administrador de la instancia debe configurar `SELLER_EMAIL` y `SELLER_INITIAL_PASSWORD` en `/etc/tienda-api.env` y reiniciar `tienda-api`. El seed crea esa cuenta si aún no existe.
2. Inicia sesión con la cuenta de vendedor.
3. **Panel Vendedor** permite consultar el catálogo y las boletas. No muestra acciones para editar productos.

## Evidencias para la entrega

Adjunta capturas propias de:

- Catálogo y carrito con descuento DUOC.
- Formulario de registro e inicio de sesión.
- Confirmación de compra con número de boleta.
- CRUD de productos desde el panel administrador.
- Panel vendedor con listado/detalle de boletas y controles de escritura ausentes.
- Pruebas de login y endpoints en Postman/Swagger.

Las capturas deben corresponder al despliegue que se entregue y no deben incluir contraseñas, tokens ni claves privadas.
