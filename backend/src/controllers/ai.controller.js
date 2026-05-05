const { improveText } = require('../services/ai.service');

const improveTextController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'El campo text es requerido',
      });
    }

    const result = await improveText(text);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error en improveText:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { improveTextController };
