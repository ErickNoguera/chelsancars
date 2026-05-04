const { improveText } = require('../services/ai.service');

const improveTextController = async (req, res) => {
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
};

module.exports = { improveTextController };
