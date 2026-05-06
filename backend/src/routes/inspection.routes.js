const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate');
const inspeccionControlador = require('../controllers/inspection.controller');

const inspeccionRules = [
  body('clientName').trim().notEmpty().withMessage('clientName es requerido'),
  body('vehicleMake').trim().notEmpty().withMessage('vehicleMake es requerido'),
  body('vehicleModel').trim().notEmpty().withMessage('vehicleModel es requerido'),
  body('licensePlate').trim().notEmpty().withMessage('licensePlate es requerido'),
  body('clientEmail').optional({ checkFalsy: true }).isEmail().withMessage('clientEmail debe ser un email válido'),
  body('vehicleYear').optional({ checkFalsy: true }).isInt({ min: 1900, max: 2100 }).withMessage('vehicleYear debe ser un año válido'),
  body('mileage').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('mileage debe ser un número positivo'),
];

// Ruta pública (sin JWT) — debe ir ANTES del middleware verifyToken
router.get(
  '/publico',
  [
    query('client').trim().notEmpty().withMessage('client es requerido'),
    query('plate').trim().notEmpty().withMessage('plate es requerido'),
  ],
  validate,
  inspeccionControlador.buscarPublico
);

// A partir de aquí todas las rutas requieren JWT válido
router.use(verifyToken);

// IMPORTANTE: la ruta /search debe ir ANTES de /:id
router.get('/search', inspeccionControlador.buscar);

router.post('/', inspeccionRules, validate, inspeccionControlador.crear);
router.get('/', inspeccionControlador.listar);
router.get('/:id', [param('id').isUUID().withMessage('id debe ser un UUID válido')], validate, inspeccionControlador.obtenerUna);
router.put('/:id', [param('id').isUUID().withMessage('id debe ser un UUID válido'), ...inspeccionRules], validate, inspeccionControlador.actualizar);
router.delete('/:id', [param('id').isUUID().withMessage('id debe ser un UUID válido')], validate, inspeccionControlador.eliminar);

module.exports = router;
