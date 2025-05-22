# FRONT LOANS - Gestor de Deudas 💰

👉 [Repositorio oficial del proyecto](https://github.com/miusuario/backend)

Aplicación web para administrar deudas personales, construida con:
- ⚛️ React + Vite
- 🎨 Tailwind CSS
- 📦 LocalStorage (persistencia)
- 🧩 Context API

## Historias de Usuario ✅

### HU-01: Visualizar pagos pendientes
- [x] Pestaña "Pagos Pendientes"
- [x] Cards con título, deudor y monto
- [ ] Ordenamiento por fecha
- [x] Cálculo automático de intereses

### HU-02: Crear nueva deuda
- [x] Botón flotante (+)
- [x] Formulario con validación
- [x] Campos: Deudor, Monto, Interés, Fecha
- [x] Persistencia en LocalStorage

### HU-03: Detalle y gestión de deudas
- [x] Modal al hacer clic en card
- [x] Visualización completa de datos
- [x] Botones: Eliminar/Modificar
- [x] Historial de cambios
- [ ] Animaciones de transición (opcional)

### HU-04: Mis deudas (por implementar)
- [ ] Pestaña separada
- [ ] Visualización como acreedor
- [ ] Mismas funcionalidades que HU-01/03

### HU-05: Modificar deudas
- [x] Formulario editable
- [x] Actualización de historial
- [x] Persistencia de cambios

### HU-06: Cancelar deudas
- [x] Confirmación antes de eliminar
- [x] Eliminación de LocalStorage
- [ ] Opción de comentario (opcional)

### HU-07: Navegación entre secciones
- [x] Tabs para "Pagos Pendientes"
- [ ] Tab para "Mis Deudas" (pendiente)
- [ ] Indicador visual activo

## Cómo ejecutar 🚀

1. Clona el repositorio:
```bash
git clone [tu-repo-url]
cd loans-app
npm i
npm run dev
