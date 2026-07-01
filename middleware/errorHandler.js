const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: messages
    });
  }

  if (err.code === 11000) {
    const champ = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Le champ '${champ}' existe déjà.`
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide.'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
};

module.exports = errorHandler;
