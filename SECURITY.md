# 📸 Cámara - Guía de Environments y Seguridad

## Ambientes Disponibles

### 1. **Development** (Desarrollo Local)
```bash
npm start
# URL: http://localhost:4200
# API: /api (usa proxy a http://localhost/Camara/api)
```

### 2. **Staging** (Pruebas)
```bash
ng build --configuration staging
# URL: https://staging.tu-dominio.com
# API: https://staging.tu-dominio.com/api
```

### 3. **Production** (Producción)
```bash
ng build --configuration production
# URL: https://tu-dominio.com
# API: https://tu-dominio.com/api
```

---

## 🔐 Seguridad - Admin Access

### Panel de Admin
- **Ruta**: `/admin-login`
- **Acceso**: Requiere contraseña
- **Ubicación**: Oculta hasta validación

### Flujo de Autenticación
1. Usuario accede a `/admin-login`
2. Ingresa contraseña
3. Angular envía POST a `/api/validate-admin.php`
4. Si es correcta, recibe token
5. Token se guarda en `sessionStorage`
6. Guard (`adminGuard`) valida token
7. Acceso a `/admin-upload`

### Contraseña del Admin
**IMPORTANTE**: La contraseña está en `.env.local` (NO en el código)

**Para cambiar la contraseña**:
```bash
# En .env.local
ADMIN_PASSWORD=nueva_contraseña_segura
```

---

## 📦 Estructura de Carpetas

```
src/app/
├── environments/
│   ├── environments.ts              # Importador dinámico
│   ├── environment.development.ts   # Dev local
│   ├── environment.staging.ts       # Staging
│   └── environment.production.ts    # Production
├── pages/
│   ├── admin/
│   │   ├── admin-login.ts           # Panel de login (nueva)
│   │   └── admin-upload.ts          # Panel de carga (protegido)
├── services/
│   ├── admin.service.ts             # Validación admin (nueva)
│   └── alumnoservices.ts
└── core/
    └── guards/
        ├── auth-guard.ts            # Usuarios normales
        └── admin-guard.ts           # Administradores (nueva)
```

---

## 🚀 Deploy a Producción

### 1. Cambiar contraseña admin
```bash
# En servidor production:
echo "ADMIN_PASSWORD=contraseña_muy_segura_123" > .env.production
```

### 2. Build para production
```bash
ng build --configuration production
```

### 3. Servidor debe tener HTTPS
```bash
# Configurar certificados SSL en nginx/apache
```

### 4. Variables de entorno en servidor
```bash
# En servidor production (.env.local)
ADMIN_PASSWORD=contraseña_segura
DB_HOST=bd.example.com
DB_USER=usuario_bd
DB_PASS=contraseña_bd
DB_NAME=camara_prod
```

---

## 🔑 Buenas Prácticas

✅ **Hace:**
- Contraseña en `.env.local` (no versionada)
- Tokens en `sessionStorage` (sesión)
- Guards en rutas protegidas
- HTTPS en producción
- Validación en backend

❌ **No Hace:**
- ❌ Hardcodear contraseñas en código
- ❌ Guardar contraseña en localStorage (persistente)
- ❌ Confiar solo en validación frontend
- ❌ HTTP en producción
- ❌ Mostrar rutas admin en HTML/JS

---

## 🧪 Testing

### Test local admin
```bash
# 1. Ir a http://localhost:4200/admin-login
# 2. Contraseña: 1234 (desde .env.local)
# 3. Deberías ver panel de carga
```

### Ver requests en consola (F12)
```javascript
// Network tab → POST /api/validate-admin.php
// Ver request body: {password: "1234"}
// Ver response: {valid: true, token: "..."}
```

---

## ⚠️ Troubleshooting

### "No file uploaded"
- Verifica que seleccionaste archivo Excel
- Revisa console (F12) para ver errores

### "DB connection failed"
- Verifica `.env.local` tiene credenciales correctas
- Comprueba que MySQL está corriendo

### "Invalid password"
- Verifica contraseña en `.env.local`
- Limpia `sessionStorage` (F12 → Application)

---

## 📝 Checklist Pre-Deploy

- [ ] Cambiar `ADMIN_PASSWORD` en `.env.local` (producción)
- [ ] Verificar `apiUrl` en `environment.production.ts`
- [ ] Verificar HTTPS disponible
- [ ] Crear `.env.local` en servidor
- [ ] Run: `ng build --configuration production`
- [ ] Copiar dist/ al servidor web
- [ ] Test admin login en producción
- [ ] Verificar CORS headers en PHP

---

**Última actualización**: 2026-06-11
