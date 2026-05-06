# Contexto completo — Chelsan Cars

Este documento describe en detalle el proyecto Chelsan Cars para ser usado como contexto por una IA al generar publicaciones de LinkedIn, entradas de portafolio, o cualquier presentación profesional del trabajo.

---

## ¿Qué es Chelsan Cars?

Chelsan Cars es un negocio real de inspección vehicular ubicado en Santiago de Chile. El cliente necesitaba una solución digital para reemplazar su proceso manual de inspecciones: antes llenaba formularios en papel o documentos Word, los cuales eran difíciles de organizar, buscar y entregar al cliente.

El proyecto es una aplicación web fullstack desarrollada de forma freelance, completamente desde cero, que digitaliza el proceso de inspección, almacena los informes en la nube y permite al cliente final descargar su propio informe en PDF sin necesidad de registro.

---

## Problema que resuelve

- Eliminación de formularios físicos o documentos Word desorganizados
- Almacenamiento centralizado de todos los informes en la nube (PostgreSQL)
- Entrega digital inmediata del informe al cliente final vía descarga PDF
- Redacción asistida por IA para mejorar la calidad técnica de las observaciones
- Acceso desde cualquier dispositivo (responsive)
- Gestión segura con autenticación JWT y sesiones persistentes

---

## Tipo de proyecto

- **Tipo:** Aplicación web fullstack SaaS para cliente real
- **Modalidad:** Freelance
- **Estado:** Producción activa
- **Repositorio:** Privado / GitHub
- **Deploy:** Netlify (frontend) + Render (backend) + Neon (base de datos)

---

## Stack tecnológico completo

### Frontend
- **React 18** con hooks funcionales (useState, useEffect, custom hooks)
- **Vite 5** como bundler y servidor de desarrollo
- **Axios** con interceptores de request y response para manejo automático de JWT
- **jsPDF 4** para generación de PDF con diseño personalizado directamente en el navegador
- **CSS puro** con variables CSS personalizadas, diseño responsive sin frameworks
- **React Icons** para iconografía

### Backend
- **Node.js** con **Express 5**
- **PostgreSQL** como base de datos relacional con columna JSONB para datos flexibles
- **JWT** (jsonwebtoken) con sistema de access token (15 min) + refresh token (7 días)
- **bcrypt** para hash de contraseñas
- **express-validator** para validación y sanitización de inputs en todos los endpoints
- **express-rate-limit** para protección contra fuerza bruta y abuso de API
- **Helmet** para headers de seguridad HTTP
- **dotenv** para gestión de variables de entorno
- **CORS** configurado por whitelist de dominios

### Inteligencia Artificial
- **OpenAI GPT-4o-mini** integrado en el backend para mejorar la redacción de observaciones técnicas
- El frontend nunca accede directamente a la API de OpenAI — todo pasa por el backend con autenticación JWT

### Base de datos (PostgreSQL / Neon)
- **Neon**: PostgreSQL serverless en la nube con SSL obligatorio
- 4 tablas: `admin_users`, `refresh_tokens`, `inspections`, `migrations`
- `inspections` usa columna `data_json JSONB` para almacenar el formulario completo con flexibilidad
- Sistema de migraciones propio (sin ORM): archivos SQL numerados + tabla `migrations` para tracking

### Testing
- **Jest + Supertest** en el backend: 13 tests para middleware de autenticación y endpoints críticos
- **Vitest + React Testing Library** en el frontend: 4 tests para el componente de login
- Servicios mockeados para evitar dependencia de base de datos real en los tests

### Infraestructura y Deploy
- **Netlify**: deploy automático del frontend, configurado con `netlify.toml`
- **Render**: servidor Node.js persistente (no serverless), configurado con `render.yaml`
- **Neon**: PostgreSQL cloud con SSL, plan gratuito con conexión por connection string

---

## Arquitectura del sistema

### Patrón MVC en backend
```
Request → Route → Middleware (auth, validate, rateLimit) → Controller → Service → DB
```

### Flujo de autenticación
1. Admin hace login con usuario y contraseña
2. Backend devuelve access token (15 min) + refresh token (7 días)
3. Frontend almacena ambos en localStorage
4. Cada request incluye el access token en el header Authorization
5. Cuando el access token expira (401), el interceptor de Axios usa el refresh token para obtener uno nuevo automáticamente
6. El usuario nunca es deslogueado mientras el refresh token esté vigente
7. Al cerrar sesión, el refresh token es invalidado en la base de datos

### Flujo de generación de PDF
1. Admin completa el formulario (30+ campos)
2. Los datos se guardan en PostgreSQL con `data_json` JSONB
3. jsPDF genera el PDF directamente en el navegador con diseño personalizado
4. El cliente puede buscar su informe con nombre + patente y descargar el PDF sin login

---

## Funcionalidades detalladas

### Panel de administración
- Login seguro con rate limiting (5 intentos por 15 minutos)
- Formulario de inspección con secciones: datos del cliente/vehículo, verificación legal, inspección mecánica, scanner, carrocería, interior, conclusión final
- Contador de caracteres en textareas con límite de 800 caracteres
- Botón "Mejorar con IA" en cada observación técnica
- Autoguardado en localStorage (no se pierden datos al cerrar accidentalmente)
- Descarga de PDF con confirmación visual toast
- Listado paginado de inspecciones con búsqueda por patente o nombre de cliente
- CRUD completo de inspecciones

### Portal público
- Búsqueda por nombre de cliente + patente del vehículo
- Descarga del informe en PDF
- Confirmación visual de descarga exitosa dentro del modal

### PDF generado
- Diseño profesional con logo de Chelsan Cars
- Header con degradado personalizado (amarillo #FED42A a marrón #896B3E, colores de marca)
- Tarjeta resumen con datos del vehículo y cliente
- Secciones con degradado de color
- Soporte para texto largo con salto de página automático
- Pie de página en cada hoja
- Firma del inspector

---

## Seguridad implementada

| Medida | Detalle |
|---|---|
| Rate limiting login | 5 requests por IP cada 15 minutos |
| Rate limiting IA | 25 requests por IP cada 15 minutos |
| Rate limiting refresh | 30 requests por IP cada 15 minutos |
| Helmet | 14 headers de seguridad HTTP |
| express-validator | Validación y sanitización en todos los endpoints |
| JWT dual token | Access token 15min + refresh token 7 días con revocación en BD |
| CORS whitelist | Solo el dominio de Netlify puede llamar al backend |
| Logs en producción | Solo mensajes, nunca stack traces ni datos sensibles |
| Variables de entorno | Credenciales y API keys nunca en el código |

---

## Sistema de migraciones

Sistema propio desarrollado desde cero (sin Knex, Sequelize ni herramientas externas):
- Archivos SQL numerados en `/migrations/`
- Tabla `migrations` en la BD registra cuáles ya fueron aplicadas
- Cada migración corre en una transacción: si falla, hace rollback automático
- Comando: `npm run db:migrate`

---

## Desafíos técnicos resueltos

1. **CORS en producción**: configuración por whitelist para bloquear orígenes no autorizados
2. **SSL con Neon**: configuración de `rejectUnauthorized: false` para certificados de Neon
3. **API key de OpenAI**: movida del frontend al backend con protección JWT
4. **Refresh tokens**: interceptor Axios que renueva el token automáticamente y reintenta la request original
5. **Conflicto React/jsPDF**: jsPDF manipulaba el DOM simultáneamente con React, resuelto manteniendo el toast siempre en el DOM y controlando visibilidad con CSS
6. **Migraciones en producción**: sistema propio que permite evolucionar el esquema sin romper datos existentes

---

## Métricas del proyecto

- **Commits:** 40+ commits a lo largo del desarrollo
- **Tests:** 17 tests automatizados (13 backend + 4 frontend)
- **Endpoints API:** 10 endpoints REST
- **Tablas en BD:** 4
- **Migraciones:** 2 (esquema inicial + refresh tokens)
- **Líneas de código:** ~3.000+ entre frontend y backend

---

## Lo que demuestra este proyecto

- Capacidad de desarrollar un producto completo de principio a fin para un cliente real
- Conocimiento de seguridad web (OWASP): rate limiting, headers, validación, tokens
- Integración de IA (OpenAI) de forma segura en una aplicación productiva
- Manejo de autenticación moderna con refresh tokens y renovación automática
- Generación de documentos PDF personalizados en el navegador
- Deploy y configuración de infraestructura cloud (Netlify + Render + Neon)
- Testing automatizado con mocking de dependencias externas
- Sistema de migraciones de base de datos propio y funcional
- Diseño responsive sin frameworks CSS externos
