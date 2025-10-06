# Sistema de Gestión de Biblioteca – Frontend

Este documento describe las decisiones de diseño y el proceso seguido para crear el prototipo frontend del sistema de gestión de biblioteca.

## Arquitectura

- **Framework**: Angular 20 con componentes standalone.
- **UI**: Angular Material para componentes y Tailwind CSS para utilidades de diseño, logrando una interfaz moderna y responsiva.
- **Ruteo**: División entre vistas públicas (`/auth`) y privadas (dentro del `MainLayoutComponent`).
- **Estado**: Se emplean *signals* de Angular para estados locales (sesión, listados, colas de operaciones).
- **Servicios**: `AuthService`, `BookService`, `UserService` y `LoanService` encapsulan la comunicación con el backend Spring Boot.
- **Seguridad**: Interceptor `authInterceptor` añade tokens JWT a las peticiones. `errorInterceptor` centraliza manejo de errores.
- **Estructuras lineales**: `OperationTrackerService` usa lista, pila y cola para rastrear acciones y diferidos, exponiendo la información en el dashboard y navegación lateral.

## Interfaz y experiencia de usuario

- **Layouts**:
  - `AuthLayoutComponent`: pantalla dividida con mensaje de bienvenida y formularios de autenticación.
  - `MainLayoutComponent`: `mat-sidenav` con navegación, historial y top bar con menú de usuario.
- **Dashboard**: métricas clave, gráfico doughnut (ng2-charts), lista de préstamos recientes y cards de libros destacados.
- **Gestión de libros**: filtros avanzados, tabla responsive, diálogo reutilizable para crear/editar libros y etiquetas dinámicas.
- **Usuarios**: listado con roles, acceso a detalle en modal y desactivación.
- **Préstamos**: listado, creación con selección de usuarios/libros disponibles y registro de devoluciones.
- **Plus features**: cola simulada de operaciones, indicadores visuales, mensajes contextualizados y modo responsive.

## Buenas prácticas

- Separación por dominios (`features`, `core`, `layout`, `shared`).
- Tipos y DTOs centralizados en `core/models`.
- Uso de `ChangeDetectionStrategy.OnPush` en componentes críticos.
- Notificaciones uniformes mediante `NotificationService` y `MatSnackBar`.
- Tests unitarios (`AuthService`, `OperationTrackerService`, `App`).

## Retos y soluciones

- **Integración Tailwind + Angular Material**: se configuró Tailwind 3 manualmente y se definió un tema Material en `styles.scss`.
- **Manejo de estado compartido**: se usaron `signals` para sincronizar catálogos y préstamos sin depender de bibliotecas externas.
- **Disponibilidad de datos auxiliares**: se añadieron métodos como `getAvailableBooks` para alimentar formularios sin sobreescribir el estado global.
- **Reactividad y rendimiento**: se optó por `provideAnimations`, `withFetch` y signals para reducir cargas innecesarias.

## Pruebas

- `ng test` valida servicios críticos y la raíz del proyecto.
- Las operaciones clave (login, cola de operaciones, creación/edición de libros, préstamos y usuarios) han sido revisadas manualmente mediante los servicios Angular conectados a los endpoints descritos en la documentación del backend.

## Próximos pasos sugeridos

- Implementar recuperación de contraseña y perfil de usuario.
- Añadir paginación/ordenamiento real con `MatPaginator` y `MatSort` enlazados al backend.
- Incorporar notificaciones push/WebSocket para actualizaciones en tiempo real.
- Mejorar accesibilidad (navegación con teclado, contrastes).