# 🚀 Guía de Deployment - Lumina Beauty

Esta guía te llevará paso a paso para deployar Lumina Beauty en Vercel con PostgreSQL.

## Prerrequisitos

- ✅ Cuenta de GitHub
- ✅ Cuenta de Vercel (gratis en [vercel.com](https://vercel.com))
- ✅ Código del proyecto listo en un repositorio de GitHub

---

## Paso 1: Preparar el Repositorio de Git

### 1.1 Inicializar Git (si no está inicializado)
```bash
# En la raíz del proyecto
git init
git add .
git commit -m "Initial commit: Lumina Beauty System"
```

### 1.2 Crear repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Nombra el repositorio: `lumina-beauty`
3. Click "Create repository"

### 1.3 Subir código a GitHub
```bash
git remote add origin https://github.com/TU-USUARIO/lumina-beauty.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Crear Proyecto en Vercel

### 2.1 Importar desde GitHub
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Selecciona tu repositorio `lumina-beauty`
4. Click "Import"

### 2.2 Configurar el Proyecto
- **Framework Preset**: Next.js (detectado automáticamente)
- **Root Directory**: `./` (no cambiar)
- **Build Command**: `prisma generate && next build` (ya configurado en vercel.json)
- **Output Directory**: `.next` (ya detectado)

**⚠️ NO HACER DEPLOY TODAVÍA**, primero configuraremos la base de datos.

---

## Paso 3: Crear Base de Datos PostgreSQL en Vercel

### 3.1 Crear Postgres Database
1. En el dashboard de Vercel, ve a tu proyecto
2. Click en la pestaña **"Storage"**
3. Click **"Create Database"**
4. Selecciona **"Postgres"**
5. Nombra la base de datos: `lumina-beauty-db`
6. Selecciona región: **Washington, D.C., USA (iad1)** (o la más cercana)
7. Click **"Create"**

### 3.2 Conectar Database al Proyecto
1. Una vez creada, click en el nombre de la base de datos
2. Ve a la pestaña **".env.local"**
3. Verás variables como `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.
4. **IMPORTANTE**: Usaremos `POSTGRES_PRISMA_URL` para Prisma

---

## Paso 4: Configurar Variables de Entorno

### 4.1 En Vercel Dashboard
1. Ve a tu proyecto → Settings → Environment Variables
2. Agrega las siguientes variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `[copia POSTGRES_PRISMA_URL de la bd]` | URL de PostgreSQL |
| `AUTH_SECRET` | `[genera un secreto]` | Secret para JWT (min 32 caracteres) |
| `NEXT_PUBLIC_APP_URL` | `https://tu-proyecto.vercel.app` | URL de tu app en producción |

### 4.2 Generar AUTH_SECRET
En tu terminal local:
```bash
# Genera un secret aleatorio de 32 caracteres
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copia el resultado y úsalo como `AUTH_SECRET` en Vercel.

### 4.3 Configurar para todos los entornos
- Marca las tres casillas: **Production**, **Preview**, **Development**
- Click "Save" en cada variable

---

## Paso 5: Ejecutar Migraciones

### 5.1 Desde tu Terminal Local
```bash
# Copia el DATABASE_URL de producción a tu .env local temporalmente
# Esto es solo para ejecutar las migraciones una vez

# En .env local temporalmente:
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Ejecuta las migraciones
npx prisma db push

# Opcional: ejecuta el seed para datos iniciales
npx prisma db seed
```

**⚠️ IMPORTANTE**: Después de las migraciones, **restaura tu .env local** a SQLite:
```env
DATABASE_URL="file:./dev.db"
```

---

## Paso 6: Deploy!

### 6.1 Primer Deploy
1. En Vercel Dashboard → Deployments
2. Click **"Redeploy"** o trigger un deploy con:
```bash
git push origin main
```

### 6.2 Verificar Deploy
1. Espera a que el build termine (~2-3 minutos)
2. Verás un mensaje: **"Deployment Ready"**
3. Click en **"Visit"** para ver tu app en vivo

---

## Paso 7: Verificación Post-Deploy

### 7.1 Checklist de Verificación
- [ ] Landing page carga correctamente
- [ ] Puedes navegar a `/book`
- [ ] Puedes navegar a `/login`
- [ ] Puedes crear una cuenta
- [ ] Puedes iniciar sesión
- [ ] Dashboard carga (si tienes usuario con role ADMIN)
- [ ] No hay errores en la consola del navegador

### 7.2 Si algo falla
**Ver logs en tiempo real:**
```bash
vercel logs tu-proyecto.vercel.app --follow
```

O en Vercel Dashboard → Deployments → [Selecciona el deploy] → "Logs"

---

## Paso 8: Configuración de Dominio (Opcional)

### 8.1 Usar Dominio Personalizado
1. En Vercel Dashboard → Settings → Domains
2. Click "Add"
3. Ingresa tu dominio: `www.luminabeauty.com`
4. Sigue las instrucciones para configurar DNS

### 8.2 Actualizar NEXT_PUBLIC_APP_URL
1. Ve a Settings → Environment Variables
2. Edita `NEXT_PUBLIC_APP_URL`
3. Cambia a: `https://www.luminabeauty.com`
4. Redeploy para aplicar cambios

---

## 🔧 Troubleshooting

### Problema: "Prisma Client not generated"
**Solución:**
```bash
# En vercel.json, asegúrate de tener:
{
  "buildCommand": "prisma generate && next build"
}
```

### Problema: "Database connection failed"
**Solución:**
- Verifica que `DATABASE_URL` en Vercel tenga `?sslmode=require` al final
- Usa `POSTGRES_PRISMA_URL` en lugar de `POSTGRES_URL`

### Problema: "No se pueden cargar las páginas protegidas"
**Solución:**
- Verifica que `AUTH_SECRET` esté configurado en Vercel
- Debe ser el mismo en todos los entornos (Production, Preview, Development)

### Problema: "Errores de TypeScript en build"
**Solución:**
```bash
# Ejecuta localmente para ver errores:
npm run build

# Corrige los errores y sube los cambios
git add .
git commit -m "Fix: TypeScript errors"
git push
```

---

## 🔄 Workflow de Desarrollo Continuo

### Para futuros cambios:
```bash
# 1. Haz cambios en tu código local
# 2. Prueba localmente
npm run dev

# 3. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push

# 4. Vercel automáticamente hará deploy!
```

### Para rollback:
1. Ve a Vercel Dashboard → Deployments
2. Encuentra el deployment que funcionaba
3. Click "···" (tres puntos) → "Promote to Production"

---

## 📊 Monitoreo y Analytics

### Vercel Analytics (Gratis)
1. En Vercel Dashboard → Analytics
2. Click "Enable"
3. Verás métricas de:
   - Páginas vistas
   - Visitantes únicos
   - Tiempo de carga
   - Core Web Vitals

### Logs en Tiempo Real
```bash
# Con Vercel CLI
npm install -g vercel
vercel login
vercel logs --follow
```

---

## 💡 Tips de Optimización

### Performance
- ✅ Imágenes optimizadas automáticamente por Next.js
- ✅ Caching automático en edge network de Vercel
- ✅ Incremental Static Regeneration (ISR) habilitado

### Costos
- **Gratis hasta:**
  - 100 GB de bandwidth/mes
  - 100 GB-Hrs de build time
  - PostgreSQL hobby plan (256MB)

### Escalabilidad
Cuando necesites más:
1. Upgrade a Vercel Pro ($20/mes)
2. Upgrade a Postgres Pro plan
3. Considera Vercel Edge Functions para APIs

---

## 🎉 ¡Listo!

Tu aplicación está en producción y lista para recibir usuarios.

**URL de Producción:** `https://tu-proyecto.vercel.app`

### Próximos Pasos:
1. Configura un dominio personalizado
2. Habilita Vercel Analytics
3. Configura CI/CD con tests automáticos
4. Agrega monitoring de errores (Sentry)

---

**¿Problemas?** Abre un issue en: [github.com/TU-USUARIO/lumina-beauty/issues](https://github.com/TU-USUARIO/lumina-beauty/issues)
