# 🎨 Lumina Beauty - Sistema de Gestión para Salones de Belleza

<div align="center">

![Lumina Beauty](https://img.shields.io/badge/Lumina-Beauty-d4af37?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-teal?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)

**Sistema profesional de gestión (POS) para salones de belleza con interfaz moderna, sistema de reservas inteligente y dashboard administrativo completo.**

[Demo](#) · [Reportar Bug](https://github.com/yourusername/lumina-beauty/issues) · [Solicitar Feature](https://github.com/yourusername/lumina-beauty/issues)

</div>

---

## ✨ Características Principales

### 🗓️ Sistema de Reservas Público
- **Wizard de reservas paso a paso** con validación en tiempo real
- Selección de servicio, estilista, fecha y horario
- **Calendario inteligente** con detección automática de conflictos
- Intervalos de 30 minutos (9:00 AM - 5:00 PM)
- Integración de pago con Banco Nacional de Bolivia (BNB)
- Confirmación inmediata por email (próximamente)

### 📊 Dashboard Administrativo
- **KPIs en tiempo real**: ingresos, citas, nuevos clientes
- Vista de agenda diaria con citas activas
- Gestión completa de citas (crear, editar, cancelar)
- **Sistema de reportes** con filtros por fecha y estilista
- Gestión de servicios con precios y duración
- Administración de personal (estilistas y admins)

### 👥 Control de Acceso por Roles
- **ADMIN**: Acceso completo al sistema
- **STAFF**: Dashboard y citas asignadas
- **CUSTOMER**: Reserva de citas e historial

### 🎨 Diseño Premium
- Interfaz moderna con paleta de colores elegante (Gold & Rose)
- Modo claro con soporte para modo oscuro
- Totalmente responsive (mobile-first)
- Animaciones suaves con Framer Motion
- Componentes reutilizables con Radix UI

---

## 🚀 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, TypeScript 5 |
| **Estilos** | Tailwind CSS 4, OKLCH Colors |
| **Base de Datos** | PostgreSQL (Production), SQLite (Dev) |
| **ORM** | Prisma 5 |
| **Autenticación** | JWT con jose library |
| **Validación** | Zod + React Hook Form |
| **UI Components** | Radix UI + custom components |
| **Animaciones** | Framer Motion |
| **Notificaciones** | Sonner (toast notifications) |
| **Deployment** | Vercel |

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ y npm
- PostgreSQL (para producción) o SQLite (desarrollo local)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/yourusername/lumina-beauty.git
cd lumina-beauty
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env`:
```env
# Base de Datos (SQLite para desarrollo local)
DATABASE_URL="file:./dev.db"

# Autenticación (genera un secret fuerte para producción)
AUTH_SECRET="your-super-secret-jwt-key-32-chars-min"

# URL de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configurar la base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

# (Opcional) Poblar con datos de ejemplo
npx prisma db seed
```

### 5. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Schema de Base de Datos

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  password  String
  role      String   @default("USER") // ADMIN, STAFF, CUSTOMER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Service {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  duration    Int      // minutos (múltiplo de 30)
}

model Appointment {
  id            String   @id @default(cuid())
  startDateTime DateTime
  status        String   @default("PENDING") // PENDING, CONFIRMED, CANCELLED, COMPLETED
  userId        String
  staffId       String?
  serviceId     String
}
```

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Build de producción
npm start            # Inicia servidor de producción

# Base de datos
npx prisma studio    # Abre GUI de Prisma para ver la BD
npx prisma migrate dev  # Crea migración (PostgreSQL)
npx prisma db push   # Sincroniza schema (SQLite)

# Calidad de código
npm run lint         # Ejecuta ESLint
```

---

## 🚢 Deployment en Vercel

### Opción 1: Deploy desde el Dashboard de Vercel
1. Sube tu código a GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa tu repositorio
4. Configura las variables de entorno (ver sección abajo)
5. ¡Deploy!

### Opción 2: Deploy desde CLI
```bash
npm install -g vercel
vercel
```

### Variables de Entorno en Vercel
En el dashboard de Vercel, agrega estas variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | String de conexión de Vercel Postgres |
| `AUTH_SECRET` | `random-32-char-string` | Secret para firmar JWTs |
| `NEXT_PUBLIC_APP_URL` | `https://tu-app.vercel.app` | URL de producción |

**Para generar un AUTH_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Configurar Base de Datos PostgreSQL
1. En Vercel Dashboard → Storage → Create Database → Postgres
2. Copia el `DATABASE_URL` y agrégalo a las variables de entorno
3. Ejecuta las migraciones:
```bash
npx prisma db push
```

**📖 Guía completa: [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📸 Screenshots

### Landing Page
*Landing page moderna con diseño premium y call-to-action claro*

### Sistema de Reservas
*Wizard de 5 pasos con calendario inteligente y detección de conflictos*

### Dashboard Administrativo
*Vista general con KPIs en tiempo real y agenda del día*

---

## 🗺️ Estructura del Proyecto

```
beauty-system/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Grupo de rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/           # Panel administrativo
│   │   ├── appointments/
│   │   ├── reports/
│   │   ├── services/
│   │   ├── staff/
│   │   └── settings/
│   ├── book/                # Reserva pública
│   ├── layout.tsx           # Layout raíz con metadata SEO
│   ├── page.tsx             # Landing page
│   ├── sitemap.ts           # Sitemap dinámico
│   └── robots.ts            # Configuración de robots.txt
├── actions/                 # Server Actions
│   ├── auth.ts
│   ├── booking.ts
│   ├── dashboard.ts
│   ├── reports.ts
│   └── services.ts
├── components/              # Componentes React
│   ├── booking/
│   ├── dashboard/
│   └── ui/                  # Componentes reutilizables
├── lib/                     # Utilidades
│   ├── auth.ts              # Helpers de autenticación JWT
│   ├── prisma.ts            # Cliente de Prisma
│   ├── env.ts               # Validación de variables de entorno
│   ├── utils.ts
│   └── validations/         # Schemas de validación Zod
│       ├── auth.ts
│       ├── booking.ts
│       ├── service.ts
│       └── staff.ts
├── prisma/
│   ├── schema.prisma        # Schema de base de datos
│   └── seed.js              # Datos iniciales
├── public/                  # Assets estáticos
├── middleware.ts            # Middleware de autenticación
├── .env.example             # Template de variables de entorno
├── vercel.json              # Configuración de Vercel
└── package.json
```

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT tokens con expiración de 1 semana
- ✅ Cookies httpOnly para prevenir XSS
- ✅ Middleware para protección de rutas
- ✅ ValidValidación de entrada con Zod
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Variables de entorno validadas

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles.

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

- [ ] Notificaciones por correo electrónico
- [ ] Recordatorios automáticos de citas (24h antes)
- [ ] Sistema de calificaciones y reseñas
- [ ] Historial de cliente con servicios favoritos
- [ ] Gestión de inventario
- [ ] Analytics avanzados con gráficas
- [ ] Aplicación móvil nativa
- [ ] Integración con WhatsApp Business

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más información.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/yourprofile)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el increíble framework
- [Vercel](https://vercel.com/) por el hosting gratuito
- [Radix UI](https://www.radix-ui.com/) por los componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho con ❤️ para la comunidad de salones de belleza

</div>
