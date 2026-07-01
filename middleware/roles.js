const { error } = require('../utils/apiResponse');

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Accès réservé aux administrateurs.', 403);
  }
  next();
};

const clientOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'client') {
    return error(res, 'Accès réservé aux clients.', 403);
  }
  next();
};

module.exports = { adminOnly, clientOnly };
