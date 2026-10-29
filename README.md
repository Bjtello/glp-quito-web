# 🔧 GLP Quito Web

Aplicación web integral para la gestión de turnos, agendamientos, catálogo de repuestos, inspección técnica (Check-in con evidencia fotográfica en la nube) y mantenimiento de vehículos a GLP (Gas Licuado de Petróleo) en Quito, Ecuador.

Desarrollada con **Angular 21**, **Firebase** (Authentication y Realtime Database), **Cloudinary** (almacenamiento y optimización de imágenes), **Tailwind CSS** y soporte para **Server-Side Rendering (SSR)** con Express. Cuenta con un sistema de control de acceso por roles (`admin` y `usuario`), actualización de turnos en tiempo real, validación inteligente de disponibilidad y registro de recepción de automotores.

---

## 📋 Estado del Proyecto: Funcionalidades Implementadas

A continuación se detalla todo lo que el sistema tiene desarrollado y operativo:

### 1. 🔐 Autenticación y Control de Accesos (RBAC)
- **Inicio de Sesión (`/login`)**:
  - Autenticación con correo y contraseña vía Firebase Authentication (`signInWithEmailAndPassword`).
  - Consulta automática del rol asignado en la base de datos en tiempo real (`usuarios/{uid}`).
  - Persistencia del rol en `localStorage` y redirección inmediata a `/usuarios`.
- **Registro de Clientes (`/registro`)**:
  - Creación pública de nuevas cuentas de cliente.
  - Asignación automática del rol predeterminado `'usuario'` en Realtime Database.
  - Autologin inmediato con persistencia de sesión y redirección.
- **Protección de Rutas mediante Guards (Compatibles con SSR)**:
  - `authGuard`: Protege rutas internas verificando la presencia de sesión activa en el navegador; redirige a `/login` a usuarios no autenticados.
  - `adminGuard`: Restringe rutas exclusivas para usuarios con rol `'admin'`; redirige a `/home` a quienes no tengan permisos administrativos.
- **Cierre de Sesión y Reactividad**:
  - Salida segura (`signOut`) con limpieza de tokens y `localStorage` desde la barra de navegación.

### 2. 🛠️ Panel de Administración y Check-in de Vehículos (`/admin`)
- Protegido por `adminGuard` (acceso exclusivo para administradores).
- **Gestión de Cuentas y Roles**:
  - Creación de nuevos usuarios directamente en Firebase Auth (`createUserWithEmailAndPassword`).
  - Asignación explícita de rol (`admin` o `usuario`) almacenado en el nodo `usuarios/{uid}`.
- **Inspección Técnica y Check-in de Vehículos en Taller**:
  - Lista de turnos y automotores agendados en tiempo real sincronizados con Firebase.
  - **Registro de notas de ingreso**: campo para registrar observaciones físicas iniciales del vehículo (ej. rayones, abolladuras, nivel de combustible o fallas previas reportadas).
  - **Evidencia fotográfica en la nube (Cloudinary)**:
    - Selector de archivos fotográficos con subida directa a Cloudinary mediante `CloudinaryService`.
    - Indicador visual animado de carga (*spinner*) mientras se procesa y optimiza la imagen.
    - Persistencia de la URL segura (`secure_url`) y las notas en el objeto `estadoIngreso` del turno en Firebase.
    - **Visualización inmediata**: muestra la tarjeta con la vista previa de la foto almacenada y las notas de inspección del vehículo.

### 3. 📅 Sistema Inteligente de Agendamiento y Cola en Vivo (`/usuarios`)
- **Formulario Reactivo de Reservas (`formulario-reserva`)**:
  - Captura de datos del cliente: nombre, teléfono/WhatsApp, placa del vehículo y tipo de servicio.
  - Restricción de fecha mínima: no permite seleccionar fechas pasadas (`min = hoy`).
  - **Lógica de disponibilidad y turnos por bloques**:
    - Franjas horarias fijas de 2 horas: `08:00`, `10:00`, `12:00`, `14:00` y `16:00`.
    - Consulta dinámica a Firebase (`getClientesPorFecha`) al seleccionar o cambiar la fecha.
    - Ocupación horaria: filtra en tiempo real las horas ya tomadas para ese día.
    - **Regla especial para instalaciones completas**: Si se selecciona *"Instalación 5ta Generación"*, se requiere y bloquea el día completo (no se puede agendar si ya hay turnos ese día, ni se permite agendar otros turnos si hay una instalación programada).
- **Integración con Repuestos**:
  - Recepción de repuestos vía parámetro URL (`?repuesto=...`).
  - Pre-llenado automático en la reserva con opción de remoción mediante badge interactivo.
- **Cola de Mantenimiento en Tiempo Real ("Sistema En Vivo")**:
  - Sincronización continua de la lista de turnos mediante suscripción reactiva a Firebase Realtime Database (`onValue`).
  - Estados visuales de turnos: `EN CURSO` (verde) y `FINALIZADO` (gris).
  - Formato adaptado tanto para escritorio (tabla estructurada) como para móviles (tarjetas individuales).
- **Acciones Administrativas en la Cola**:
  - Si el usuario es administrador (`isAdmin`):
    - Botón **"Completar"**: cambia el estado de un turno activo a `'finalizado'`.
    - Botón **"Editar"**: carga los datos de un agendamiento finalizado de nuevo en el formulario para modificarlos.
    - Botón **"Eliminar"**: confirmación y borrado físico del registro en Firebase Database.

### 4. 🔩 Catálogo Interactivo de Repuestos (`/repuestos`)
- Catálogo de repuestos y accesorios originales de GLP (kits de 5ta generación, reductores de presión, inyectores, cilindros de 45L con norma INEN, filtros, bujías de iridio, válvulas de seguridad con corte automático, sensores de fuga, ECU, mangueras de alta presión, etc.).
- **Filtro dinámico por categorías**:
  - `Todos`, `Conversión`, `Mantenimiento`, `Seguridad` y `Accesorios`.
- Badges destacados (*Más vendido*, *Nuevo*, *Certificado*).
- **Acción "Solicitar Repuesto"**: redirige automáticamente al usuario al formulario de agendamiento (`/usuarios?repuesto=...`), preseleccionando el componente en su cita.

### 5. 🌐 Páginas Informativas y Propuesta de Valor
- **Inicio (`/home`)**:
  - Componente Hero personalizable con información clave: ahorro de combustible al 98%, sistema AEB Lovato, ubicación en La Nueva Aurora (Sur de Quito) y botón directo de cotización vía WhatsApp.
- **Equipos y Componentes (`/servicios`)**:
  - Fichas técnicas explicativas de cada componente de una conversión de 5ta generación: cilindro GLP certificado, multiválvula Tomasetto Achille, reductor-evaporador, riel de inyectores, computadora/ECU y switch conmutador.
- **Nosotros (`/nosotros`)**:
  - Trayectoria y respaldo: más de 15 años de experiencia técnica.
  - Perfil del especialista **Jorge Tello** con enlace directo a WhatsApp personalizado.
  - 4 tarjetas de valor (ahorro, seguridad, garantía y atención técnica).

### 6. 📱 Experiencia de Usuario y Shell Dinámico (`App`, `Nav`, `Footer`)
- **Shell Inteligente**:
  - Ocultamiento automático de la barra de navegación (`app-nav`) y el pie de página (`app-footer`) en las pantallas de `/login` y `/registro` mediante Signals y escucha de eventos del enrutador.
- **Barra de Navegación Responsiva (`Nav`)**:
  - Menú desktop y menú hamburguesa colapsable para dispositivos móviles.
  - Detección reactiva de sesión activa y rol (`admin` / `usuario`).
  - Acceso condicional: muestra el enlace a *Admin Panel* únicamente a administradores y *Cola de Turnos* a usuarios con sesión iniciada.
  - Enlaces activos destacados con `routerLinkActive`.
  - Botón de contacto directo a WhatsApp y botón de cierre de sesión.
- **Pie de Página (`Footer`)**:
  - Ubicación, contacto telefónico, redes sociales y horarios de atención en Quito.

---

## 🗂️ Estructura del Código Fuente

```
glp-quito-web/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── guards/
│   │   │       ├── admin.guard.ts         # Protección de rutas exclusivas de admin
│   │   │       └── auth.guard.ts          # Protección de rutas para usuarios autenticados
│   │   ├── features/
│   │   │   ├── admin-panel/               # Panel admin: usuarios y check-in fotográfico
│   │   │   ├── home/                      # Portada con componente Hero
│   │   │   ├── login/                     # Autenticación con Firebase Auth
│   │   │   ├── nosotros/                  # Historia, experiencia y perfil técnico
│   │   │   ├── registro-cliente/          # Alta pública de nuevos clientes (autologin)
│   │   │   ├── repuestos/                 # Catálogo interactivo con filtros por categoría
│   │   │   ├── servicios/                 # Detalles técnicos de equipos de 5ta generación
│   │   │   └── usuarios/                  # Contenedor de agendamiento y cola de turnos
│   │   ├── model/
│   │   │   └── usuario.ts                 # Modelos Usuario y EstadoIngreso (check-in)
│   │   ├── services/
│   │   │   ├── cliente-servicio.ts        # CRUD y filtros reactivos en Firebase Database
│   │   │   ├── cliente-servicio.spec.ts   # Pruebas unitarias de ClienteServicio
│   │   │   ├── cloudinary.service.ts      # Subida de fotos de vehículos a Cloudinary
│   │   │   └── cloudinary.service.spec.ts # Pruebas unitarias de CloudinaryService
│   │   ├── shared/
│   │   │   ├── footer/                    # Pie de página general
│   │   │   ├── formulario-reserva/        # Formulario reactivo y tabla de turnos en vivo
│   │   │   ├── hero/                      # Banner principal reutilizable
│   │   │   └── nav/                       # Barra de navegación responsiva con auth
│   │   ├── app.config.server.ts           # Configuración SSR de la aplicación
│   │   ├── app.config.ts                  # Proveedores principales (Router, Hydration, HTTP Fetch)
│   │   ├── app.routes.server.ts           # Configuración de modos de renderizado en servidor
│   │   ├── app.routes.ts                  # Declaración y protección de rutas
│   │   ├── app.html                       # Layout maestro con Shell condicional
│   │   └── app.ts                         # Componente raíz con control reactivo de visibilidad
│   ├── index.html                         # Plantilla HTML raíz
│   ├── main.server.ts                     # Entrada para el renderizado SSR
│   ├── main.ts                            # Bootstrap de cliente e inicialización de Firebase
│   ├── server.ts                          # Servidor Express para SSR
│   └── styles.css                         # Configuración e importación de Tailwind CSS
├── angular.json                           # Configuración del workspace Angular CLI
├── package.json                           # Dependencias y scripts
├── tailwind.config.js                     # Configuración de temas y purga de Tailwind
└── tsconfig.json                          # Configuración de TypeScript
```

---

## 🚦 Tabla de Rutas de la Aplicación

| Ruta | Componente | Acceso / Protección | Shell (Nav/Footer) |
|---|---|---|:---:|
| `/` | *Redirige a `/login`* | Público | Oculto |
| `/login` | `Login` | Público | Oculto |
| `/registro` | `RegistroCliente` | Público | Oculto |
| `/home` | `Home` | Requiere autenticación (`authGuard`) | Visible |
| `/servicios` | `Servicios` | Requiere autenticación (`authGuard`) | Visible |
| `/nosotros` | `Nosotros` | Requiere autenticación (`authGuard`) | Visible |
| `/repuestos` | `Repuestos` | Requiere autenticación (`authGuard`) | Visible |
| `/usuarios` | `UsuariosComponent` | Requiere autenticación (`authGuard`) | Visible |
| `/admin` | `AdminPanel` | Requiere rol administrador (`adminGuard`) | Visible |

---

## 🗄️ Modelo de Datos (`src/app/model/usuario.ts`)

```typescript
export interface EstadoIngreso {
  fechaRegistro: string;  // Marca de tiempo ISO del check-in (ej. '2026-10-29T15:30:00.000Z')
  fotosUrls: string[];    // Lista de URLs públicas seguras de Cloudinary
  notas: string;          // Observaciones de recepción técnica del vehículo
}

export interface Usuario {
  id?: string;                  // Clave única autogenerada por Firebase Realtime Database
  nombre: string;               // Nombre completo del cliente
  telefono: string;             // Número de contacto o WhatsApp
  placaVehiculo: string;        // Placa del automotor (ej. PCQ-1234)
  tipoServicio: string;         // Tipo de servicio ('Instalación 5ta Generación', etc.)
  estado?: string;              // Estado actual: 'en curso' | 'finalizado'
  fecha?: string;               // Fecha asignada en formato 'YYYY-MM-DD'
  hora?: string;                // Bloque horario seleccionado (ej. '08:00', '10:00')
  repuesto?: string;            // Nombre del repuesto solicitado (opcional)
  estadoIngreso?: EstadoIngreso;// Datos del check-in e inspección técnica inicial
}
```

---

## ⚙️ Servicios de la Aplicación

### 1. `ClienteServicio` (`src/app/services/cliente-servicio.ts`)
Encapsula la comunicación reactiva con Firebase Realtime Database bajo la colección `clientes`:

| Método | Operación | Descripción |
|---|---|---|
| `postCliente(cliente)` | `push` + `set` | Registra un nuevo agendamiento en la base de datos. |
| `getClientes()` | `onValue` | Escucha reactiva en tiempo real de todos los agendamientos activos. |
| `getClienteById(id)` | `get` + `child` | Obtiene los detalles de un agendamiento por su ID único. |
| `putCliente(id, cliente)` | `update` | Actualiza datos, estado (`finalizado`) o el reporte de `estadoIngreso`. |
| `deleteCliente(id)` | `remove` | Elimina permanentemente un agendamiento de la base de datos. |
| `getClientesPorFecha(fecha)` | `get` + filtro | Consulta los turnos de una fecha determinada para calcular bloques disponibles. |

### 2. `CloudinaryService` (`src/app/services/cloudinary.service.ts`)
Gestiona la subida directa de archivos multimedia desde el navegador a la nube sin comprometer credenciales secretas:

| Parámetro / Método | Tipo | Descripción |
|---|---|---|
| `cloudName` | `string` | Nombre del entorno Cloudinary (`hhrjnbhd`). |
| `uploadPreset` | `string` | Preset unsigned configurado (`glp_vehiculos`). |
| `subirImagenVehiculo(file)` | `Observable<string>` | Envía el archivo vía `POST` mediante `FormData` a la API REST de Cloudinary y retorna la `secure_url` HTTPS generada. |

---

## 🚀 Stack Tecnológico

| Tecnología | Versión | Rol en el Proyecto |
|---|---|---|
| **Angular** | ^21.2.0 | Framework frontend (Standalone Components, Signals, Router) |
| **Angular SSR** | ^21.2.19 | Server-Side Rendering y optimización de carga |
| **Express** | ^5.1.0 | Servidor web Node.js para servir SSR |
| **Firebase** | ^12.19.0 | Authentication y Realtime Database en tiempo real |
| **Cloudinary** | REST API v1_1 | Almacenamiento, distribución y optimización de imágenes en la nube |
| **Tailwind CSS** | ^3.4.19 | Estilos de utilidad y diseño responsivo |
| **TypeScript** | ~5.9.2 | Lenguaje tipado |
| **RxJS** | ~7.8.0 | Flujos asíncronos y observables reactivos |
| **Vitest** | ^4.0.8 | Framework de pruebas unitarias |

---

## 💻 Instalación y Ejecución

### Prerrequisitos
- **Node.js**: Versión 20 o superior
- **npm**: Versión 11 o superior

### 1. Clonar e instalar dependencias
```bash
git clone <url-del-repositorio>
cd glp-quito-web
npm install
```

### 2. Ejecución en entorno de desarrollo
```bash
npm start
# o también:
ng serve
```
Navega a `http://localhost:4200/` en tu navegador.

### 3. Compilación para producción (con SSR)
```bash
npm run build
```
Genera los artefactos optimizados tanto de cliente como de servidor en la carpeta `dist/glp-quito-web/`.

### 4. Ejecución del servidor SSR en producción
```bash
npm run serve:ssr:glp-quito-web
# o directamente con node:
node dist/glp-quito-web/server/server.mjs
```

### 5. Ejecución de pruebas unitarias
```bash
npm test
```

---

## 📍 Ubicación y Contacto
- **Taller**: Sector La Nueva Aurora, Sur de Quito, Ecuador.
- **Especialista**: Jorge Tello (Técnico especialista en sistemas AEB Lovato).
- **Atención**: WhatsApp y citas en línea a través de la plataforma web.
