const Produit = require('../models/Produit');
const Alerte = require('../models/Alerte');
const { success, error, paginated } = require('../utils/apiResponse');

exports.liste = async (req, res, next) => {
  try {
    const { categorie, recherche, minPrix, maxPrix, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (categorie) filter.categorie = categorie;
    if (recherche) filter.nom = { $regex: recherche, $options: 'i' };
    if (minPrix || maxPrix) {
      filter.prix = {};
      if (minPrix) filter.prix.$gte = parseFloat(minPrix);
      if (maxPrix) filter.prix.$lte = parseFloat(maxPrix);
    }

    const total = await Produit.countDocuments(filter);
    const produits = await Produit.find(filter)
      .populate('categorie', 'nom slug')
      .sort('nom')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    paginated(res, produits, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const produit = await Produit.findById(req.params.id).populate('categorie', 'nom slug');
    if (!produit) {
      return error(res, 'Produit non trouvé.', 404);
    }
    success(res, produit);
  } catch (err) {
    next(err);
  }
};

exports.creer = async (req, res, next) => {
  try {
    const { nom, description, prix, stock, seuil_alerte, categorie } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const produit = await Produit.create({
      nom, description, prix, stock, seuil_alerte, categorie, image
    });

    if (produit.alerte_active) {
      await Alerte.create({
        produit: produit._id,
        message: `Stock faible pour "${produit.nom}" : ${produit.stock} unité(s)`,
        type: produit.stock === 0 ? 'rupture' : 'stock_faible'
      });
    }

    success(res, produit, 'Produit créé', 201);
  } catch (err) {
    next(err);
  }
};

exports.modifier = async (req, res, next) => {
  try {
    const { nom, description, prix, stock, seuil_alerte, categorie } = req.body;
    const image = req.file ? req.file.filename : req.body.image;
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      { nom, description, prix, stock, seuil_alerte, categorie, image },
      { new: true, runValidators: true }
    );

    if (!produit) {
      return error(res, 'Produit non trouvé.', 404);
    }

    await produit.mettreAJourAlerte();

    success(res, produit, 'Produit modifié');
  } catch (err) {
    next(err);
  }
};

exports.supprimer = async (req, res, next) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) {
      return error(res, 'Produit non trouvé.', 404);
    }
    await Alerte.deleteMany({ produit: req.params.id });
    success(res, null, 'Produit supprimé');
  } catch (err) {
    next(err);
  }
};
