## Objetivo del proyecto

Aplicación de lista de tareas colaborativa con:
- Login simulado para 2 usuarios.
- Crear/editar/eliminar y completar tareas con autor y metadatos de edición.
- Búsqueda dinámica por texto o autor y filtros rápidos por autor.
- Persistencia mediante JSON Server (API REST falsa).
- UI responsive con Tailwind y notificaciones con Toastify.

## Requisitos

- Node.js >= 18
- npm o pnpm

## Instalación

```bash
npm install
```

## Scripts

- Frontend (Vite):
```bash
npm run dev
```
- Backend simulado (JSON Server en 3001):
```bash
npm run server-api
```

## Ejecución

1) En una terminal: levantar la API
```bash
npm run server-api
```
API base: http://localhost:3001

2) En otra terminal: levantar el frontend
```bash
npm run dev
```

3) Navegar a la URL que muestre Vite y loguearse.

## Credenciales de prueba

- Usuario: `cristal`  Contraseña: `1234`
- Usuario: `catalina` Contraseña: `4567`

## Endpoints principales (JSON Server)

- GET    `/tasks`           Lista de tareas
- POST   `/tasks`           Crear tarea
- PATCH  `/tasks/:id`       Editar texto o estado/completado y metadatos
- DELETE `/tasks/:id`       Eliminar tarea

Ejemplo de tarea
```json
{
  "id": 1,
  "text": "Hacer la demo",
  "completed": false,
  "author": "cristal",
  "createdBy": "cristal",
  "createdAt": "2025-09-30T09:13:44.425Z",
  "updatedBy": null,
  "updatedAt": null
}
```

## Estructura del proyecto (resumen)

- `src/App.jsx`: lógica principal, llamadas Axios, búsqueda/filtros y render. Comentado.
- `src/toDoItem.jsx`: tarjeta de tarea, edición, “editado por … hace …”. Comentado.
- `src/components/SearchInput.jsx`: input con debounce. Comentado.
- `src/components/PrivateRoute.jsx`: protege rutas según sesión.
- `src/context/AuthContext.jsx`: autenticación simulada, persistencia y sync entre pestañas. Comentado.
- `db.json`: base de datos del JSON Server.

## Notas para demo

- Abrir dos pestañas con usuarios distintos para ver edición y “hace X tiempo”.
- Probar filtros rápidos por autor y búsqueda por texto/autor.
- Mostrar toasts al crear/editar/eliminar.

## Autores

- Cristal Leal
- Catalina Perez