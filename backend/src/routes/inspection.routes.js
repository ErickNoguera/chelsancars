const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const inspeccionControlador = require('../controllers/inspection.controller');

// Ruta pública (sin JWT) — debe ir ANTES del middleware verifyToken
// Permite a los clientes buscar su informe por patente
router.get('/publico', inspeccionControlador.buscarPublico);

// A partir de aquí todas las rutas requieren JWT válido
router.use(verifyToken);

// IMPORTANTE: la ruta /search debe ir ANTES de /:id
// para que "search" no sea interpretado como un ID
router.get('/search', inspeccionControlador.buscar);

router.post('/', inspeccionControlador.crear);
router.get('/', inspeccionControlador.listar);
router.get('/:id', inspeccionControlador.obtenerUna);
router.put('/:id', inspeccionControlador.actualizar);
router.delete('/:id', inspeccionControlador.eliminar);

module.exports = router;
