# 🤝 Guía de Contribución - Lumina Beauty

¡Gracias por tu interés en contribuir a Lumina Beauty! Este documento proporciona pautas para contribuir al proyecto.

## 📋 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y acogedor para todos. Esperamos que:

- Uses un lenguaje acogedor e inclusivo
- Respetes los diferentes puntos de vista y experiencias
- Aceptes las críticas constructivas con gracia
- Te enfoques en lo que es mejor para la comunidad

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor abre un issue con:

1. **Título descriptivo** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs **comportamiento actual**
4. **Screenshots** si es aplicable
5. **Información del entorno** (navegador, OS, versión de Node)

**Template de Bug Report:**
```markdown
**Descripción del Bug**
Una descripción clara y concisa del bug.

**Pasos para Reproducir**
1. Ve a '...'
2. Click en '....'
3. Scroll down a '....'
4. Ver error

**Comportamiento Esperado**
Lo que esperabas que sucediera.

**Screenshots**
Si es aplicable, agrega screenshots.

**Entorno:**
 - OS: [e.g. Windows 11]
 - Navegador [e.g. Chrome 120]
 - Versión de Node [e.g. 18.17.0]
```

### Solicitar Features

Para solicitar nuevas funcionalidades:

1. **Verifica** que no exista un issue similar
2. **Describe** claramente el feature que propones
3. **Explica** el caso de uso y beneficios
4. **Proporciona** ejemplos o mockups si es posible

### Pull Requests

1. **Fork** el repositorio
2. **Crea** una branch desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/descripcion-del-bug
   ```
3. **Haz** tus cambios siguiendo las guías de estilo
4. **Escribe** commits descriptivos (ver guía abajo)
5. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-descriptivo
   ```
6. **Abre** un Pull Request

## 📝 Guía de Estilo de Código

### TypeScript/JavaScript
- Usa **TypeScript** para todo el código
- Sigue las reglas de **ESLint** configuradas
- Usa **nombres descriptivos** para variables y funciones
- **Comenta** código complejo cuando sea necesario
- Prefiere **const** sobre **let**, evita **var**

```typescript
// ✅ Bueno
const getUserAppointments = async (userId: string) => {
  return await prisma.appointment.findMany({
    where: { userId },
  });
};

// ❌ Malo
var getAppts = async (id) => {
  return await prisma.appointment.findMany({ where: { userId: id } });
};
```

### React Components
- Usa **functional components** con hooks
- Prefiere **Server Components** por defecto
- Usa **Client Components** ("use client") solo cuando sea necesario
- Extrae lógica compleja a custom hooks

```tsx
// ✅ Server Component (por defecto)
export default async function AppointmentsPage() {
  const appointments = await getAppointments();
  return <AppointmentList appointments={appointments} />;
}

// ✅ Client Component (solo cuando es necesario)
"use client";
export function BookingWizard({ services }: Props) {
  const [step, setStep] = useState(1);
  // ...
}
```

### CSS/Tailwind
- Usa **Tailwind CSS** para estilos
- Mantén las clases **ordenadas** (layout → spacing → colors → typography)
- Usa **componentes reutilizables** para patrones comunes

```tsx
// ✅ Ordenado y legible
<div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-foreground">Título</h2>
</div>
```

### Prisma Schema
- Usa **nombres en singular** para models
- Usa **camelCase** para campos
- **Documenta** relaciones complejas

```prisma
// ✅ Bueno
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  // Relación: Un usuario puede tener muchas citas como cliente
  appointments Appointment[] @relation("CustomerAppointments")
}
```

## 🧪 Testing (Próximamente)

Actualmente el proyecto no tiene tests, pero planeamos agregar:
- Unit tests con Jest
- Integration tests
- E2E tests con Playwright

Si quieres contribuir con tests, ¡serás bienvenido!

## 📦 Commits Convencionales

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Tipos de Commits:
- **feat**: Nueva funcionalidad
- **fix**: Corrección de bugs
- **docs**: Cambios en documentación
- **style**: Cambios de formato (no afectan el código)
- **refactor**: Refactorización de código
- **perf**: Mejoras de performance
- **test**: Agregar o modificar tests
- **chore**: Cambios en build, CI, etc.

### Ejemplos:
```bash
git commit -m "feat: add email notifications for appointments"
git commit -m "fix: resolve booking conflict detection issue"
git commit -m "docs: update README with deployment instructions"
git commit -m "refactor: simplify booking wizard logic"
```

## 🏗️ Estructura del Proyecto

Antes de contribuir, familiarízate con la estructura:

```
beauty-system/
├── app/              # Next.js App Router (páginas y rutas)
├── actions/          # Server Actions (lógica del servidor)
├── components/       # Componentes React reutilizables
├── lib/             # Utilidades y helpers
├── prisma/          # Schema de base de datos
└── public/          # Assets estáticos
```

## 🔍 Proceso de Revisión

Todos los PRs serán revisados antes de merge. El proceso incluye:

1. **Automated checks**:
   - ✅ Build exitoso
   - ✅ Lint sin errores
   - ✅ TypeScript sin errores

2. **Code review**:
   - Código limpio y mantenible
   - Sigue las guías de estilo
   - Funcionalidad completa
   - Sin bugs obvios

3. **Feedback**:
   - Responde a comentarios de revisión
   - Haz cambios solicitados
   - Push de actualizaciones al mismo PR

## 🎨 Diseño y UX

Si contribuyes con cambios de interfaz:

- Mantén la **paleta de colores** existente (Gold & Rose)
- Asegura **responsive design** (mobile-first)
- Sigue los **patrones de componentes** establecidos
- Considera **accesibilidad** (ARIA labels, keyboard navigation)
- Agrega **animaciones suaves** cuando sea apropiado

## 📞 ¿Preguntas?

Si tienes preguntas sobre cómo contribuir:

- Abre un **issue de discusión**
- Contacta al mantenedor principal
- Revisa **issues existentes** para ver si ya fue respondido

## 📜 Licencia

Al contribuir a Lumina Beauty, aceptas que tus contribuciones sean licenciadas bajo la Licencia MIT del proyecto.

---

**¡Gracias por contribuir a Lumina Beauty!** 🎉

Tu tiempo y esfuerzo ayudan a mejorar el sistema para toda la comunidad de salones de belleza.
