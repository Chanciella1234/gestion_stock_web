const Alerte = require('../models/Alerte');
const { success, error } = require('../utils/apiResponse');

exports.liste = async (req, res, next) => {
  try {
    const alertes = await Alerte.find()
      .populate('produit', 'nom stock seuil_alerte')
      .sort('-createdAt');
    success(res, alertes);
  } catch (err) {
    next(err);
  }
};

exports.resoudre = async (req, res, next) => {
  try {
    const alerte = await Alerte.findByIdAndUpdate(
      req.params.id,
      { resolu: true },
      { new: true }
    );

    if (!alerte) {
      return error(res, 'Alerte non trouvée.', 404);
    }

    success(res, alerte, 'Alerte résolue');
  } catch (err) {
    next(err);
  }
};
