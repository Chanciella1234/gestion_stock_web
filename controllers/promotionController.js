const Promotion = require('../models/Promotion');
const { success, error } = require('../utils/apiResponse');

exports.liste = async (req, res, next) => {
  try {
    const promotions = await Promotion.find()
      .populate('produits_applicables', 'nom prix')
      .populate('categories_applicables', 'nom')
      .sort('-createdAt');
    success(res, promotions);
  } catch (err) {
    next(err);
  }
};

exports.creer = async (req, res, next) => {
  try {
    const { code, type, valeur, date_debut, date_fin, actif, produits_applicables, categories_applicables } = req.body;

    if (!code || !type || valeur === undefined || !date_debut || !date_fin) {
      return error(res, 'Code, type, valeur, date_debut et date_fin sont requis.', 400);
    }
    if (!['pourcentage', 'montant_fixe'].includes(type)) {
      return error(res, 'Le type doit être "pourcentage" ou "montant_fixe".', 400);
    }

    const promotion = await Promotion.create({
      code, type, valeur, date_debut, date_fin, actif,
      produits_applicables, categories_applicables
    });

    success(res, promotion, 'Promotion créée', 201);
  } catch (err) {
    next(err);
  }
};

exports.modifier = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return error(res, 'Promotion non trouvée.', 404);
    }

    success(res, promotion, 'Promotion modifiée');
  } catch (err) {
    next(err);
  }
};

exports.supprimer = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return error(res, 'Promotion non trouvée.', 404);
    }
    success(res, null, 'Promotion supprimée');
  } catch (err) {
    next(err);
  }
};

exports.verifier = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return error(res, 'Code promo requis.', 400);
    }

    const promotion = await Promotion.findOne({ code: code.toUpperCase() })
      .populate('produits_applicables', 'nom prix')
      .populate('categories_applicables', 'nom');

    if (!promotion || !promotion.estValide()) {
      return error(res, 'Code promo invalide ou expiré.', 400);
    }

    success(res, {
      code: promotion.code,
      type: promotion.type,
      valeur: promotion.valeur,
      description: promotion.type === 'pourcentage'
        ? `${promotion.valeur}% de réduction`
        : `${promotion.valeur}FBU de réduction`,
      produits_applicables: promotion.produits_applicables,
      categories_applicables: promotion.categories_applicables
    }, 'Code promo valide');
  } catch (err) {
    next(err);
  }
};
