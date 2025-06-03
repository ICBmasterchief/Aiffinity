# Aiffinity

Aplicación de citas con chat instantáneo basada en tecnologías modernas. Este repositorio contiene el frontend, el backend, la base de datos y Redis, orquestados mediante Docker Compose para facilitar la puesta en marcha local.

---

## Prerrequisitos

- **Docker** ≥ 20.10
- **Docker Compose** ≥ 1.29
- Git (para clonar el repositorio)

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/ICBmasterchief/Aiffinity.git
cd Aiffinity
```

---

## 2. Configurar variables de entorno

- En la raíz del proyecto, hay un archivo docker-compose.yml que hace referencia a variables de entorno para backend y frontend.

- Crea (o copia) un archivo llamado ".env" dentro de la carpeta backend/ con este contenido (Dejo estas credenciales de forma temporal para que se pueda ejecutar fácilmente):

```bash
# backend/.env
DB_NAME=aiffinity_db
DB_USER=user
DB_PASSWORD=MyPassword_aiffinity
DB_ROOT_PASSWORD=MyRootPassword_aiffinity
DB_HOST=db
DB_PORT=3306

PORT=2159
JWT_SECRET=tu_secreto_jwt
OPENAI_API_KEY=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

REDIS_HOST=redis
REDIS_PORT=6379

CLOUDINARY_CLOUD_NAME=dlutrgfri
CLOUDINARY_API_KEY=516379456761389
CLOUDINARY_API_SECRET=qJ06Vkue-VSPnFwqpAco5WN0T60
```

- En la carpeta frontend/, crea un archivo ".env" con:

```bash
# frontend/.env.local
NEXT_PUBLIC_BASE_URL=http://localhost:2159
```

---

## 3. Levantar los contenedores con Docker Compose

Desde la raíz del proyecto ( ...\Aiffinity\ ):

```bash
docker-compose up -d
```

Esto descargará las imágenes (MySQL, Redis) y construirá tus imágenes de backend y frontend. Verás cuatro servicios en ejecución:

db: MySQL (puerto 3306)

redis: Redis (puerto 6379)

backend: Node.js + Apollo Server (puerto 2159)

frontend: Next.js (puerto 3000)

Para verificar que todo arrancó correctamente:

```bash
docker-compose ps
```

---

## 4. Crear la base de datos, migraciones y seeders

- Ejecutar migraciones

El backend utiliza Sequelize para gestionar el esquema de la base de datos. Una vez que MySQL está listo, corre las migraciones desde el contenedor “backend”:

```bash
docker-compose exec backend npx sequelize-cli db:migrate
```

Esto creará las tablas definidas en backend/src/models/.

- Ejecutar seeders (datos de prueba)

Si dispones de seeders definidos, cárgalos con:

```bash
docker-compose exec backend npx sequelize-cli db:seed:all
```

Esto insertará datos iniciales (usuarios de prueba). Si quieres impersonar a uno de estos usuarios el email es [[nombre]]@[[apellido]].com y la contraseña "patata".
Si no hay seeders, este paso se omitirá sin error.

---

## 5. Acceder en local

- Frontend
  Abre tu navegador en

```bash
http://localhost:3000
```

Verás la pantalla de login/registro.

- Backend (GraphQL Playground) (opcional, para depuración)
  Accede a

```bash
http://localhost:2159/graphql
```

desde donde podrás probar consultas y mutaciones manualmente.

## 8. Notas Finales

- Cloudinary: integrado en backend para subida de fotos en la nube (configurable vía variables de entorno).

- Redis: usado en el backend para notificaciones y chat en tiempo real.

- .env: NUNCA subir credenciales a GitHub. Ofrece un .env.example sin valores reales como plantilla.
  (Las credenciales aquí mostradas son solo para facilitar el testeo y en un futuro próximo dejarán de funcionar.)

¡Con estos pasos tendrás tu entorno local funcionando en minutos!
