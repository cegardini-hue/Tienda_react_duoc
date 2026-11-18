# Despliegue en EC2 (Ubuntu)

El frontend se publica en Nginx y Nginx reenvía `/api/` a Spring Boot en `127.0.0.1:8080`. El puerto 8080 no debe exponerse en el Security Group.

## 1. Preparar la instancia

En una instancia Ubuntu con acceso SSH:

```bash
sudo apt update
sudo apt install -y openjdk-21-jre-headless nginx
sudo adduser --system --group --home /var/lib/tienda-api tienda
sudo install -d -o tienda -g tienda -m 0750 /var/lib/tienda-api/data
sudo install -d -o root -g root /opt/tienda-api
sudo install -d -o www-data -g www-data /var/www/tienda
```

En el Security Group permite SSH (`22`) desde tu IP y HTTP/HTTPS (`80`/`443`) desde Internet. No abras `8080`.

## 2. Construir y copiar la API

Desde la raíz del repositorio, con Java 21:

```bash
cd backend
./mvnw clean test package
```

En Windows ejecuta `.\mvnw.cmd clean test package` desde `backend`. El Wrapper descarga Maven la primera vez. El JAR queda en `backend/target/tienda-api-1.0.0.jar`. Desde Windows PowerShell, copia el JAR y los archivos de configuración (ajusta usuario, IP y clave SSH):

```powershell
scp -i C:\ruta\a\tu-clave.pem backend\target\tienda-api-1.0.0.jar ubuntu@IP_EC2:/tmp/tienda-api.jar
scp -i C:\ruta\a\tu-clave.pem backend\deploy\tienda-api.service ubuntu@IP_EC2:/tmp/tienda-api.service
scp -i C:\ruta\a\tu-clave.pem deploy\nginx\tienda.conf ubuntu@IP_EC2:/tmp/tienda.conf
```

En EC2:

```bash
sudo install -o root -g root -m 0644 /tmp/tienda-api.jar /opt/tienda-api/tienda-api.jar
sudo install -o root -g root -m 0644 /tmp/tienda-api.service /etc/systemd/system/tienda-api.service
```

## 3. Configurar secretos y primer administrador

Genera la clave JWT directamente en EC2; no la guardes en Git ni la compartas:

```bash
openssl rand -base64 48
```

Crea `/etc/tienda-api.env` con permisos restringidos:

```bash
sudo install -o root -g root -m 0600 /dev/null /etc/tienda-api.env
sudo nano /etc/tienda-api.env
```

Contenido (reemplaza todos los valores):

```ini
PORT=8080
DB_PATH=/var/lib/tienda-api/data/tienda
JWT_SECRET=PEGA_AQUI_EL_RESULTADO_DE_OPENSSL
JWT_EXPIRATION_SECONDS=900
CORS_ALLOWED_ORIGINS=https://TU_DOMINIO
ADMIN_EMAIL=admin@TU_DOMINIO
ADMIN_INITIAL_PASSWORD=USA_UNA_CLAVE_ALEATORIA_DE_12_O_MAS_CARACTERES
```

Al primer inicio se crea ese usuario como administrador si el correo aún no existe. Guarda la clave inicial en un gestor de contraseñas. No se restablece automáticamente al cambiar la variable en inicios posteriores.
Después de confirmar el primer inicio de sesión, puedes quitar `ADMIN_INITIAL_PASSWORD` del archivo de entorno y reiniciar el servicio; el usuario existente no se modifica.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now tienda-api
sudo systemctl status tienda-api --no-pager
curl http://127.0.0.1:8080/api/health
```

Los productos iniciales se cargan automáticamente una sola vez cuando la tabla está vacía.

## 4. Publicar frontend y habilitar Nginx

Desde la raíz del repositorio:

```powershell
npm run build
tar -czf tienda-web.tar.gz -C dist .
scp -i C:\ruta\a\tu-clave.pem tienda-web.tar.gz ubuntu@IP_EC2:/tmp/tienda-web.tar.gz
```

En EC2:

```bash
sudo tar -xzf /tmp/tienda-web.tar.gz -C /var/www/tienda
sudo chown -R www-data:www-data /var/www/tienda
sudo install -o root -g root -m 0644 /tmp/tienda.conf /etc/nginx/sites-available/tienda
sudo ln -sfn /etc/nginx/sites-available/tienda /etc/nginx/sites-enabled/tienda
sudo nginx -t
sudo systemctl reload nginx
```

La plantilla está en `deploy/nginx/tienda.conf`. Cambia `server_name _;` por tu dominio si ya lo tienes. Configura TLS (por ejemplo, Certbot) antes de usar credenciales reales a través de Internet.

Con el DNS del dominio apuntando a la IP pública de EC2, instala TLS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d TU_DOMINIO
```

## 5. Probar desde el equipo local con túnel SSH

En PowerShell deja abierto el túnel:

```powershell
ssh -i C:\ruta\a\tu-clave.pem -N -L 8081:127.0.0.1:8080 ubuntu@IP_EC2
```

En otra terminal, desde la raíz del frontend:

```powershell
npm run dev -- --mode tunel
```

El frontend utiliza `.env.tunel.local` para enviar las llamadas a `http://localhost:8081/api`. Las peticiones del túnel solo exponen el puerto de API en tu equipo local.

## Mantenimiento

```bash
sudo journalctl -u tienda-api -f
sudo systemctl restart tienda-api
sudo nginx -t && sudo systemctl reload nginx
```

H2 en archivo es apropiado para una instancia pequeña o demostración. Para producción con concurrencia y alta disponibilidad, migra a MySQL administrado, configura copias de seguridad y revisa la política de migraciones antes de cambiar `ddl-auto`.
