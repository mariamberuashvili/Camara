# 📸 Cámara

App para que el alumnado de un centro educativo haga login con su **NIA + DNI/NIE**, se haga una foto con la cámara y la suba a su expediente. Incluye un panel de administración para importar listados de alumnos desde Excel.

- **Frontend**: Angular 21 (standalone components, signals, `@ngx-translate` para ca/es/en)
- **Backend**: PHP (mysqli + [PhpSpreadsheet](https://phpspreadsheet.readthedocs.io/))

---

## 📦 Estructura del proyecto

```
.
├── api/                        # Backend PHP
│   ├── conexcion.php           # Conexión MySQL (lee credenciales de .env.local)
│   ├── login.php                # POST -> valida NIA+DNI contra tabla `alumnos`
│   ├── upload_alumno.php        # POST -> sube la foto del alumno a api/uploads/
│   ├── import_alumnos.php       # POST -> importa Excel (NIA, DNI) a tabla `alumnos`
│   ├── validate-admin.php       # POST -> valida la contraseña de admin
│   └── uploads/                 # Fotos subidas (no versionar contenido real)
│
├── src/app/
│   ├── pages/
│   │   ├── login/                # Pantalla de login (NIA + DNI/NIE)
│   │   ├── photo/                 # Captura de foto con la cámara
│   │   ├── result/                 # Pantalla de éxito
│   │   └── admin/                  # admin-login + admin-upload (importar Excel)
│   ├── core/guards/                # authGuard (usuarios) y adminGuard (admin)
│   ├── services/                   # AlumnoService y AdminService (llamadas a /api)
│   ├── shared/components/header/   # Cabecera con selector de idioma
│   ├── environments/                # Configuración por entorno (ver abajo)
│   └── state.ts                     # Estado global en memoria (signals)
│
└── public/assets/i18n/             # Traducciones ca/es/en
```

---

## 🌐 Entornos (`src/app/environments/`)

Angular usa un patrón de **4 archivos** para manejar entornos, no es código duplicado:

| Archivo | Para qué sirve |
|---|---|
| `environments.ts` | Archivo que **importa siempre el código** (`environment.apiUrl`, etc.). Es un "selector". |
| `environment.development.ts` | Valores para `npm start` / `ng serve` (`apiUrl: '/api'`, vía proxy). |
| `environment.staging.ts` | Valores para `ng build --configuration staging`. |
| `environment.production.ts` | Valores para `ng build --configuration production`. |

`angular.json` hace un `fileReplacements`: al construir con `--configuration staging` o `production`, **sustituye el contenido de `environments.ts`** por el del archivo correspondiente. En desarrollo no hay reemplazo, así que `environments.ts` usa `environment.development.ts` directamente.

👉 Si necesitas cambiar la URL de la API de staging/producción, edita `environment.staging.ts` / `environment.production.ts` (nunca `environments.ts` directamente).

---

## 🔑 Variables de entorno (backend PHP)

Solo debería existir **un** archivo de credenciales reales, `**.env.local**` en la raíz del proyecto (NO se versiona, está en `.gitignore`). `api/conexcion.php` lo carga automáticamente.

```bash
# Copia la plantilla y rellena tus valores reales
cp .env.example .env.local
```

Contenido de `.env.local`:

```bash
ADMIN_PASSWORD=tu_contraseña_admin_segura

DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=tu_base_de_datos
```

`.env.example` es solo la plantilla de referencia y SÍ se versiona (sin datos reales).

---

## 🚀 Desarrollo local

Requiere Node.js + PHP. `proxy.conf.json` redirige `/api` hacia `http://localhost:8080`, donde debe estar corriendo el backend PHP.

**Terminal 1 — backend PHP** (desde la raíz del proyecto):

```bash
php -S localhost:8080 -t . dev-router.php
```

`dev-router.php` solo sirve los `.php` dentro de `api/` (bloquea acceso a `.env.local`, código fuente, etc. — es exclusivamente para desarrollo).

> Si además quieres probar `login.php`, `upload_alumno.php` o `import_alumnos.php` (usan MySQL), necesitas un MySQL corriendo y `.env.local` con las credenciales. `validate-admin.php` (admin-login) **no necesita MySQL**.

**Terminal 2 — frontend Angular**:

```bash
npm install
npm start          # http://localhost:4200, con proxy a /api
```

### Tests

```bash
npm test
```

---

## 🏗️ Build para subir a producción/staging

```bash
npm run build:staging     # -> dist/Camara/browser  (apiUrl: staging.tu-dominio.com)
npm run build:prod        # -> dist/Camara/browser  (apiUrl: tu-dominio.com)
```

### Qué subir al hosting

1. **Frontend**: el contenido de `dist/Camara/browser/*` se sube a la raíz pública del sitio. El `.htaccess` de la raíz del repo (reglas de SPA + CORS) debe acompañar a esos ficheros.
2. **Backend**: la carpeta `api/` completa, incluyendo `api/vendor/` (dependencias de PhpSpreadsheet — generadas con `composer install` dentro de `api/`) y `api/uploads/` (con permisos de escritura).
3. **Credenciales**: crear `.env.local` en el servidor (al lado de `api/`, es decir en la raíz del proyecto subido) con las credenciales reales de esa máquina. **Nunca subir `.env.local` al repositorio.**

> `proxy.conf.json` y `dev-router.php` son solo para desarrollo local — no afectan ni hace falta subirlos al hosting (aunque tampoco molestan si se suben).

---

## 🔐 Panel de administración

- Ruta: `/admin-login` → tras validar contraseña (`ADMIN_PASSWORD` en `.env.local`), redirige a `/admin-upload`.
- `/admin-upload` permite subir un Excel (columna A = NIA, columna B = DNI) que se importa/actualiza en la tabla `alumnos`.
- El token de sesión de admin se guarda en `sessionStorage` (se pierde al cerrar la pestaña) y lo valida `adminGuard`.

Más detalle de seguridad y checklist de despliegue en [`SECURITY.md`](./SECURITY.md).

---

## 🗄️ Esquema mínimo de base de datos esperado

La tabla se llama `fotos_alumnos`:

```sql
CREATE TABLE fotos_alumnos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nia        VARCHAR(10) NOT NULL UNIQUE,
  dni        VARCHAR(12) NOT NULL UNIQUE,
  photo      VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
# camara-main

