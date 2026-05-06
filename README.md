# Chelsan Cars — Sistema de Inspección Vehicular

Aplicación web fullstack para la gestión y generación de informes de inspección vehicular. Permite al equipo de Chelsan Cars crear, almacenar y descargar informes en PDF, y a los clientes consultar y descargar su propio informe de forma pública.

---

## Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | UI y manejo de estado |
| Vite | 5 | Bundler y servidor de desarrollo |
| Axios | 1 | Cliente HTTP con interceptores |
| jsPDF | 4 | Generación de PDF en el cliente |
| React Icons | 5 | Íconos |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 5 | Framework HTTP |
| PostgreSQL | — | Base de datos relacional |
| jsonwebtoken | 9 | Autenticación JWT |
| bcrypt | 6 | Hash de contraseñas |
| express-validator | 7 | Validación de inputs |
| express-rate-limit | 8 | Rate limiting |
| helmet | 8 | Headers de seguridad HTTP |
| dotenv | 17 | Variables de entorno |

### Testing
| Tecnología | Uso |
|---|---|
| Jest + Supertest | Tests unitarios e integración backend |
| Vitest + Testing Library | Tests de componentes frontend |

### Infraestructura
| Servicio | Uso |
|---|---|
| Netlify | Deploy del frontend |
| Render | Deploy del backend (Node.js persistente) |
| Neon | PostgreSQL cloud con SSL |

---

## Arquitectura

```
chelsancars/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # InspectionReport, LoginForm, DescargaPDFModal, Navbar, Hero, Footer
│   │   ├── services/          # api.js (Axios + interceptores JWT)
│   │   ├── hooks/             # useAiSuggestion
│   │   ├── utils/             # generarPDF.js
│   │   ├── styles/            # CSS por componente
│   │   └── tests/             # Vitest + Testing Library
│   └── vite.config.js
│
└── backend/                   # Node.js + Express
    ├── src/
    │   ├── controllers/       # admin, inspection, ai
    │   ├── services/          # admin, inspection, ai
    │   ├── routes/            # admin, inspection, ai
    │   ├── middlewares/       # auth, validate, rateLimiter
    │   └── db/                # Pool de conexiones PostgreSQL
    ├── migrations/            # Archivos SQL numerados
    ├── scripts/               # migrate.js
    └── tests/                 # Jest + Supertest
```

**Patrón:** MVC en el backend (Controllers → Services → DB). El frontend consume la API REST mediante Axios con interceptores que renuevan el token automáticamente.

---

## Funcionalidades

### Panel de administración (requiere login)
- Autenticación JWT con access token (15 min) y refresh token (7 días)
- Renovación automática de sesión sin interrupción
- Formulario de inspección vehicular con más de 30 campos organizados por sección
- Mejora de observaciones técnicas con IA (OpenAI GPT-4o-mini)
- Guardado automático en localStorage para no perder datos
- Generación y descarga de PDF con diseño profesional
- Listado, búsqueda, edición y eliminación de inspecciones

### Portal público (sin login)
- Búsqueda de informe por nombre de cliente y patente
- Descarga del PDF con confirmación visual

### Seguridad
- Rate limiting en login (5 req/15min) y endpoint IA (25 req/15min)
- Headers de seguridad con Helmet
- Validación de inputs con express-validator en todos los endpoints
- CORS restringido al dominio del frontend
- Credenciales y API keys exclusivamente en variables de entorno
- Logs sin datos sensibles en producción

---

## Base de datos

```sql
admin_users     -- Credenciales del administrador
refresh_tokens  -- Tokens de sesión persistente (7 días)
inspections     -- Informes de inspección con data_json JSONB
migrations      -- Registro de migraciones aplicadas
```

### Sistema de migraciones
```bash
npm run db:migrate   # Aplica archivos SQL pendientes en orden
```
Cada migración corre en una transacción con rollback automático ante error.

---

## Variables de entorno

### Backend (`.env`)
```env
DATABASE_URL=           # Connection string PostgreSQL (Neon con SSL)
JWT_SECRET=             # Secreto para access tokens
JWT_REFRESH_SECRET=     # Secreto para refresh tokens
JWT_EXPIRES_IN=15m      # Duración del access token
ADMIN_USER=             # Usuario administrador
ADMIN_PASSWORD=         # Contraseña administrador
OPENAI_API_KEY=         # API key de OpenAI (opcional)
ALLOWED_ORIGIN=         # URL del frontend (Netlify)
PORT=3000
NODE_ENV=production
```

### Frontend (`.env`)
```env
VITE_API_URL=           # URL del backend (Render)
```

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/ErickNoguera/chelsancars.git
cd chelsancars

# Backend
cd backend
cp .env.example .env    # Completar variables
npm install
npm run db:migrate
npm start               # Puerto 3000

# Frontend (nueva terminal)
cd frontend
cp .env.example .env    # Completar VITE_API_URL
npm install
npm run dev             # Puerto 5173
```

---

## Tests

```bash
# Backend (Jest + Supertest) — 13 tests
cd backend && npm test

# Frontend (Vitest + Testing Library) — 4 tests
cd frontend && npm test
```

Cobertura:
- Middleware de autenticación (token válido, expirado, inválido, sin header)
- Endpoints de login, refresh y logout con servicios mockeados
- Componente LoginForm (render, validación, login exitoso, credenciales incorrectas)

---

## Deploy

### Backend → Render
Configurado en `render.yaml`. Variables de entorno en el dashboard de Render.

### Frontend → Netlify
Configurado en `netlify.toml`. Variable `VITE_API_URL` en el dashboard de Netlify.

### Base de datos → Neon
Correr migraciones apuntando a la instancia de producción:
```bash
cd backend && npm run db:migrate
```

---

## Autor

**Erick Noguera** — Desarrollo fullstack completo
