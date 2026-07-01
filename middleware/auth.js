const { verifierToken } = require('../utils/jwtUtils');
const Utilisateur = require('../models/Utilisateur');
const { error } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return error(res, 'Accès non autorisé. Token manquant.', 401);
    }

    const decoded = verifierToken(token);
    req.user = await Utilisateur.findById(decoded.id);

    if (!req.user) {
      return error(res, 'Utilisateur non trouvé.', 401);
    }

    next();
  } catch (err) {
    return error(res, 'Token invalide ou expiré.', 401);
  }
};

module.exports = { protect };
