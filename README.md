# Pomodoro + Tareas

**🔗 Demo en vivo: [pomodoro-plus-tareas.vercel.app](https://pomodoro-plus-tareas.vercel.app/)**

Aplicación web local, responsive y mobile-first para gestionar tareas con la técnica Pomodoro. Trabajo práctico de desarrollo móvil web y multiplataforma.

## Tecnologías

- HTML5 + CSS3 (mobile-first, responsive)
- JavaScript (ES Modules, sin frameworks)
- [Vite](https://vitejs.dev/) como bundler y servidor de desarrollo
- `localStorage` para persistencia local (sin backend)

## Vistas

La app es una SPA de una sola pantalla con navegación inferior (bottom nav) entre 5 secciones:

| Vista | Descripción |
|---|---|
| ⏱️ **Timer** | Cronómetro Pomodoro (foco / descanso corto / descanso largo), con selector de tarea activa y aviso sonoro al terminar cada sesión. |
| 📋 **Tareas** | Alta de tareas, listado de activas y completadas como tarjetas, con conteo de pomodoros por tarea. |
| 📊 **Estadísticas** | Pomodoros completados hoy, esta semana y en total, tiempo de foco acumulado y tareas completadas. |
| 🕘 **Historial** | Registro cronológico de todas las sesiones (foco y descansos), agrupado por día. |
| ⚙️ **Ajustes** | Duración configurable de foco/descansos, cantidad de sesiones antes del descanso largo, sonido on/off y borrado de datos. |

Todo el estado (tareas, sesiones y ajustes) se genera y actualiza dinámicamente con JavaScript y persiste en `localStorage`, así que sobrevive a un refresh del navegador.

## Cómo correrlo

Requiere Node.js instalado.

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (por defecto `http://localhost:5173`). Para probar el layout mobile, usá las devtools del navegador en modo responsive.

### Build de producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
index.html              Shell de la SPA (header, secciones de vista, bottom nav)
src/
  main.js                Punto de entrada: registra vistas, arranca el router y el loop del timer
  style.css               Estilos mobile-first + breakpoint para desktop
  modules/
    state.js               Store central (getState/setState/subscribe) sobre localStorage
    storage.js              Carga y guardado en localStorage, estado por defecto
    router.js                Navegación entre vistas vía bottom nav
    timer.js                  Lógica del cronómetro Pomodoro y su vista
    tasks.js                  CRUD de tareas y su vista (tarjetas)
    stats.js                   Cálculo y render de estadísticas
    history.js                  Render del historial de sesiones
    settings.js                  Formulario de configuración
    utils.js                     Helpers de formato de tiempo/fecha
```

## Notas de diseño

- El cronómetro calcula el tiempo restante a partir de un timestamp de finalización (`Date.now() + segundos`) en vez de simplemente restar segundo a segundo, para que no pierda precisión si la pestaña queda en segundo plano.
- Cada tarjeta y lista se genera con template strings a partir del estado — no hay HTML estático de datos, todo sale de `localStorage` vía JS.
