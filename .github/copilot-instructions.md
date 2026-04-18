# Project Guidelines

## Code Style
- Use functional React components with hooks only (no class components)
- File extensions: `.jsx` for components, `.js` for backend
- CSS: Use custom properties for colors and consistent naming (kebab-case)
- Language: Spanish for UI text

## Architecture
- Monorepo structure: `frontend/` (Vite + React) and `backend/` (Express)
- Frontend: Landing page with sections (Navbar, Hero, Services, Contact, Footer)
- Backend: API for PDF report generation (planned)

## Build and Test
- Frontend: `cd frontend && npm install && npm run dev` (port 5173), `npm run build`
- Backend: `cd backend && npm install && node index.js` (port 3000)
- No tests yet

## Conventions
- Component naming: PascalCase for files and exports
- CSS classes: kebab-case
- Anchor links: Spanish IDs like `#contacto`
- Move hardcoded contact info to environment variables
- Add CORS middleware to backend for frontend API calls
- Install PDF library (e.g., pdfkit) for report generation
- Implement contact form with validation