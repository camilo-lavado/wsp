# WhatsApp Sender Pro 🚀

**[Español]**  
Una potente aplicación web centrada en la privacidad para gestionar y enviar mensajes masivos de WhatsApp. Diseñada para la eficiencia operativa, cuenta con gestión de campañas, librerías de plantillas, validación inteligente y un sistema de lista negra (opt-out).

![Dashboard Preview](./dashboard-preview.png)

---

## ✨ Características Clave

### 📢 Gestión de Campañas
- **Dashboard**: Visualiza todas las campañas con métricas de progreso.
- **Historial**: Accede a registros pasados y reanuda envíos pendientes.
- **Persistencia**: Datos almacenados localmente en tu navegador (IndexedDB) con años de historial.

### ⚡ Velocidad y Eficiencia
- **Modo Rápido**: Usa `Alt + Enter` para enviar automáticamente al siguiente contacto pendiente.
- **Interfaz Radical**: Diseño "Glassmorphism" moderno con animaciones fluidas.
- **Internacionalización**: Soporte completo para Inglés 🇺🇸 y Español 🇨🇱.

### 🛡️ Seguridad y Validación
- **Seguridad Robusta**: Headers CSP, sanitización de inputs y auditoría de dependencias.
- **Validación Inteligente**: Integración con `libphonenumber-js` de Google para formateo exacto.
- **Lista Negra**: Sistema de bloqueo permanente (opt-out) para evitar mensajes no deseados.
- **Gestión de Errores**: Marca números como inválidos sin perder el hilo de la campaña.

### 📊 Datos y Reportes
- **Importación Excel**: Arrastra y suelta archivos `.xlsx` o `.csv`. Mapeo automático de columnas "Nombre" y "Teléfono".
- **Exportación**: Descarga reportes detallados en Excel con hora de envío y estado de cada contacto.

---

## 🛠️ Instalación

Esta es una aplicación web construida con React y Vite. Necesitas [Node.js](https://nodejs.org/) instalado.

1.  **Clonar/Descargar** el repositorio.
2.  Abrir una terminal en la carpeta del proyecto.
3.  Instalar dependencias:
    ```bash
    npm install
    ```
4.  Iniciar el servidor local:
    ```bash
    npm run dev
    ```
5.  Abre tu navegador en `http://localhost:5173`.

---

## � Guía de Uso

### 1. Iniciar una Campaña
- Ve al **Dashboard** y haz clic en **Nueva Campaña**.
- Dale un nombre (ej. "Promo Octubre").
- Sube tu archivo Excel con los contactos.

### 2. Redactar el Mensaje
- Escribe tu mensaje en el editor.
- Usa la sintaxis `{variable}` para insertar datos de tus columnas de Excel (ej. "Hola {nombre}").
- Usa el **Gestor de Plantillas** para guardar scripts recurrentes.

### 3. Enviando
- Haz clic en **Enviar** en una fila de contacto para abrir WhatsApp Web.
- **Pro Tip**: Presiona `Alt + Enter` para enviar instantáneamente al primer contacto "Pendiente" de la lista.

### 4. Manejo de Excepciones
- **¿Número Inválido?** Abre el menú de la fila (⋮) y selecciona **Marcar Inválido**.
- **¿Usuario Opt-out?** Abre el menú de la fila (⋮) y selecciona **Lista Negra**. Esto bloquea el número para TODAS las campañas futuras.

---

## 🧪 Pruebas
Este proyecto incluye una suite de tests automatizados utilizando **Vitest** y **React Testing Library**.

Para ejecutar los tests:
```bash
npm test
```
Esto verificará la lógica de validación de teléfonos, manipulación de base de datos simulada y renderizado de componentes críticos.

---

## 🔮 Mejoras Futuras y Deuda Técnica

Para mantener la salud del proyecto, hemos identificado áreas para trabajo futuro:

### Deuda Técnica
*(Sección vacía por ahora - ¡Buen trabajo!)*

### Hoja de Ruta
- **Sincronización en la Nube**: Backup opcional encriptado.
- **Versión de Escritorio (Electron)**: Empaquetar la app con Electron para notificaciones nativas y automatización.
- **Dashboard de Analíticas**: Métricas profundas sobre tasas de envío y éxito a lo largo del tiempo.

---

## � Stack Tecnológico
- **Framework**: React + Vite
- **Estilos**: Tailwind CSS + Framer Motion
- **Datos**: IndexedDB (`idb`)
- **Internacionalización**: `react-i18next` + `i18next`
- **Utilidades**: `xlsx`, `libphonenumber-js`, `react-hot-toast`

## 🛡️ Seguridad

Esta aplicación ha sido endurecida siguiendo prácticas de seguridad modernas:

1.  **Content Security Policy (CSP)**: Headers estrictos configurados para prevenir ataques XSS.
2.  **Validación de Entradas**: Todos los datos (nombres de campañas, plantillas) son sanitizados antes de guardarse.
3.  **Auditoría de Dependencias**: Monitoreo constante de vulnerabilidades en librerías.
4.  **Almacenamiento Local**: Los datos viven en tu navegador. Si usas una computadora compartida, asegúrate de cerrar sesión o limpiar los datos del sitio al terminar.

## 🔒 Privacidad
Esta aplicación se ejecuta **100% en tu dispositivo**. No se envían datos de contactos a servidores externos, solo a WhatsApp a través de los enlaces oficiales `wa.me`.
