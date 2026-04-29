const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const inspeccionControlador = require('../controllers/inspection.controller');

// Todas las rutas de inspecciones requieren JWT válido
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
