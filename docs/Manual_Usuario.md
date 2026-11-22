# Manual de usuario — Level-Up Gamer

**Versión:** 1.0  
**Fecha:** 22 de noviembre de 2026  
**Tipo de sistema:** Tienda web académica

## 1. Introducción

### Propósito

Este manual explica cómo navegar y utilizar la tienda Level-Up Gamer. Está dirigido a clientes, administradores y vendedores que interactúan con la aplicación web.

### Descripción del sistema

La aplicación permite consultar un catálogo de productos y categorías, revisar detalles, mantener un carrito de compras, registrar e iniciar sesión en una cuenta, confirmar compras y consultar boletas. Las cuentas administradoras gestionan productos; las cuentas de vendedor consultan el catálogo y las boletas.

La compra crea una boleta, pero **no procesa pagos reales**. El sitio se entrega como demostración académica y actualmente utiliza HTTP; no se deben ingresar contraseñas reutilizadas ni datos sensibles reales.

### Cómo usar este manual

Sigue las instrucciones del rol que corresponda. Las rutas pueden escribirse directamente en la barra del navegador. Las capturas públicas muestran la versión desplegada consultada para esta documentación; las capturas de paneles autenticados deben obtenerse desde la sesión autorizada de cada evaluador y no deben contener contraseñas ni tokens.

## 2. Requisitos del sistema

### Hardware

- Computador, tablet o teléfono con pantalla y conexión a Internet.
- No se requiere hardware especial.

### Software

- Navegador actualizado (Chrome, Edge, Firefox o Safari).
- No se requiere instalar una aplicación en el dispositivo del cliente.
- Java, Node.js y la base de datos son componentes del servidor y no se instalan en el dispositivo del usuario final.

## 3. Instalación y configuración

### Acceso del usuario final

1. Conecta el dispositivo a Internet.
2. Abre un navegador actualizado.
3. Ingresa a `http://34.234.73.162/`.
4. Si la dirección no responde, confirma con el administrador de la instancia EC2 que la IP pública actual y los servicios web estén disponibles.

La dirección corresponde al despliegue consultado al preparar este manual y puede cambiar si se modifica la IP pública de EC2. El usuario final no necesita instalar ni configurar dependencias.

### Operación técnica

El despliegue del frontend y del backend se administra en el servidor EC2. La instalación de Java/Node, la configuración de Nginx, las variables del servicio API y el acceso a la instancia corresponden al equipo técnico; no son pasos de uso de la tienda.

## 4. Comenzando

### Crear una cuenta

1. En la barra superior, selecciona **Crear Cuenta** o abre `/registro`.
2. Completa nombre, correo, fecha de nacimiento y contraseña.
3. La persona debe tener al menos 18 años y la contraseña debe tener 8 caracteres o más.
4. Para optar al descuento DUOC, usa un correo terminado en `@duoc.cl` o `@duocuc.cl`.
5. Selecciona **Crear cuenta**. Si el registro es correcto, la tienda confirmará la operación y permitirá iniciar sesión.

El rol de cliente se asigna al registrarse. Las cuentas administrativas y de vendedor son provisionadas por el responsable del sistema; el formulario público no otorga esos permisos.

### Iniciar y cerrar sesión

1. Selecciona **Iniciar Sesión** o abre `/login`.
2. Ingresa el correo y la contraseña de una cuenta existente.
3. Si las credenciales son válidas, la barra superior mostrará el nombre y las opciones disponibles para el rol.
4. Para salir, selecciona **Cerrar Sesión**.

La sesión utiliza un token de acceso con vigencia configurada por el backend. Al cerrarse o expirar, vuelve a iniciar sesión. No compartas el token ni guardes contraseñas en capturas.

### Interfaz inicial

- **Mi Tienda Online / Home:** vuelve al catálogo.
- **Categorías:** abre la vista para explorar productos por categoría.
- **Carrito:** revisa los productos agregados.
- **Contacto:** consulta la sección de contacto.
- **Iniciar Sesión / Crear Cuenta:** disponible cuando no hay una sesión activa.
- **Panel Admin / Panel Vendedor:** aparece según el rol autenticado.

En pantallas estrechas, los enlaces se agrupan en el botón de menú de navegación.

## 5. Uso del software

### 5.1 Explorar el catálogo

1. Abre Home (`/`).
2. Revisa las tarjetas con imagen, categoría, nombre, descripción y precio.
3. Selecciona **Ver** para abrir el detalle de un producto.
4. Selecciona **+ Agregar** para incorporar el artículo al carrito.

### 5.2 Filtrar por categoría

1. Selecciona **Categorías** (`/categorias`).
2. Elige la categoría que quieres revisar; usa **Todas** para volver al catálogo completo, si aparece.
3. Abre un producto con **Ver** o agrégalo al carrito desde su tarjeta.

### 5.3 Revisar el detalle

En la vista del producto se muestran los datos disponibles, como nombre, imagen, descripción, categoría y precio. Usa **Agregar al carrito** para incorporarlo o vuelve al catálogo para continuar explorando.

### 5.4 Administrar el carrito

1. Abre **Carrito** (`/carrito`).
2. Usa **+** y **−** para cambiar la cantidad; al llegar a cero, el producto se quita.
3. Usa el botón de eliminar para quitar un producto individual o **Vaciar Carrito** para borrar todos.
4. Revisa el subtotal y el total.
5. Si la sesión corresponde a una cuenta con descuento DUOC, el carrito muestra un descuento del 20%. El backend vuelve a calcular el total al registrar la compra.
6. Selecciona **Proceder al Pago** para continuar.

El carrito se conserva localmente en el navegador. Borrar los datos del navegador puede eliminar su contenido antes de confirmar la compra.

### 5.5 Confirmar una compra y consultar la boleta

1. Inicia sesión con una cuenta de cliente (o una cuenta ADMIN habilitada para compra).
2. En la pantalla de entrega, completa nombre, correo y dirección.
3. Selecciona **Confirmar compra** y espera el resultado.
4. La confirmación informa el identificador de boleta y el total registrado.

Esta acción registra la compra y sus detalles en el sistema; **no equivale a un pago real** ni se conecta a una pasarela bancaria. Si ocurre un error, revisa que el carrito no esté vacío y vuelve a intentarlo cuando la API esté disponible.

### 5.6 Funciones de administrador

Se requiere una cuenta con rol ADMIN provisionada por el responsable del sistema.

1. Inicia sesión y abre **Panel Admin** o `/admin/productos`.
2. En **Listar Productos**, revisa el catálogo y usa **Agregar Nuevo** para crear un producto.
3. Completa nombre, precio, categoría, descripción y URL de imagen; guarda el formulario.
4. Usa **Editar** para actualizar un producto existente o **Eliminar** y confirma la acción para borrarlo.
5. Abre **Boletas** para consultar compras registradas y revisar sus detalles.

Si un producto no existe o la API no está disponible, la pantalla muestra un mensaje de error. No compartas credenciales administrativas ni las incluyas en evidencias.

### 5.7 Funciones de vendedor

La cuenta de vendedor debe ser provisionada por el administrador del sistema.

1. Inicia sesión con la cuenta de vendedor.
2. Abre **Panel Vendedor** o `/vendedor/productos`.
3. En **Productos**, consulta nombre, categoría y precio.
4. En **Boletas**, revisa compras y sus detalles.

El panel vendedor es de consulta y no ofrece acciones para crear, editar o eliminar productos.

## 6. Solución de problemas

| Situación | Qué hacer |
|---|---|
| La página no carga | Verifica Internet e intenta actualizar. Si persiste, solicita confirmar la IP pública y el estado de Nginx/EC2 al administrador. |
| No aparecen productos o categorías | Actualiza la página. Si continúa, informa al administrador que la API puede no estar disponible. |
| No permite iniciar sesión | Comprueba el correo y la contraseña. Si la sesión expiró, vuelve a ingresar. Para una cuenta nueva, confirma que el registro finalizó correctamente. |
| Acceso restringido al panel | Verifica que la cuenta tenga el rol correspondiente; el registro público solo crea cuentas de cliente. |
| No se registra una compra | Confirma que el carrito tenga productos y que la sesión esté activa. El sistema requiere conexión con la API. |
| La imagen de un producto no aparece | Informa al administrador; puede ser necesario corregir la URL de imagen del producto. |

## 7. Evidencias

Las imágenes públicas incorporadas al documento son evidencia de la interfaz disponible durante la elaboración. Para completar la entrega con flujos que requieren cuenta, agrega capturas propias de:

1. Catálogo y filtro de categorías.
2. Carrito y resumen de compra.
3. Confirmación de compra con boleta, usando datos de prueba.
4. Panel ADMIN mostrando listado y formulario CRUD.
5. Panel Vendedor con productos y boletas.

Cada evidencia debe incluir número, título, imagen con borde negro de 1 px y una nota breve. No muestres contraseñas, tokens, datos personales ni claves de EC2. Se recomienda difuminar correos y direcciones de entrega reales.
