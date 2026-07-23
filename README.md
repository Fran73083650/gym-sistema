# 🏋️ Sistema de Gestión de Gimnasio

Este proyecto es una aplicación web para la gestión de un gimnasio, compuesta por:

- **Base de datos:** PostgreSQL
- **Backend:** Django
- **Frontend:** React (Vite)
- **Contenerización:** Docker + Docker Compose

---

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Docker
- Docker Compose

Puedes verificarlo con:

```bash
docker --version
docker compose version
```

---

## Estructura del Proyecto

```
.
├── docker-compose.yml
├── .env
├── gym-backend/
│   └── Dockerfile
└── gym-frontend/
    └── Dockerfile
```

---

## Configuración

### 1. Crear archivo `.env`

En la raíz del proyecto, crea un archivo `.env` con el siguiente contenido:

```env
# Base de datos
POSTGRES_DB=gym_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=supersecretkey
DJANGO_DEBUG=True

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## Ejecución del Proyecto

### 1. Construir y levantar los contenedores

```bash
docker compose up --build
```

Esto iniciará:

- Base de datos en `localhost:5432`
- Backend en `http://localhost:8000`
- Frontend en `http://localhost:5173`

---

### 2. Acceder al sistema

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## Comandos útiles

### Detener contenedores

```bash
docker compose down
```

### Detener y eliminar volúmenes (reset completo)

```bash
docker compose down -v
```

### Ver logs

```bash
docker compose logs -f
```

---

## Migraciones de Base de Datos

El backend ejecuta automáticamente:

```bash
python manage.py migrate
```

al iniciar el contenedor.

Si necesitas hacerlo manualmente:

```bash
docker compose exec backend python manage.py migrate
```

---

## Notas importantes

- El backend depende de la base de datos (espera a que esté lista).
- El frontend usa variables de entorno (`VITE_API_URL`).
- El puerto `5173` es el de desarrollo de Vite.

---

## Desarrollo

Los volúmenes están configurados para desarrollo en caliente:

- Cambios en frontend → se reflejan automáticamente
- Cambios en backend → requieren reinicio si afectan dependencias

---

## Problemas comunes

### Error de conexión a la base de datos

Ejecuta:

```bash
docker compose down -v
docker compose up --build
```

---

### Puerto ocupado

Cambia los puertos en `docker-compose.yml`, por ejemplo:

```yaml
ports:
  - "8001:8000"
```

---

## Tecnologías utilizadas

- Django
- React + Vite
- PostgreSQL
- Docker

---

## Autor

Proyecto desarrollado como parte de prácticas académicas en Ingeniería de Sistemas.

---

## Recomendación

Si este proyecto te fue útil, considera darle una estrella ⭐ en GitHub.
