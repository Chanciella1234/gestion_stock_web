const Panier = require('../models/Panier');
const Produit = require('../models/Produit');
const { success, error } = require('../utils/apiResponse');

exports.obtenir = async (req, res, next) => {
  try {
    let panier = await Panier.findOne({ utilisateur: req.user._id })
      .populate('lignes.produit');

    if (!panier) {
      panier = await Panier.create({ utilisateur: req.user._id, lignes: [] });
    }

    success(res, panier);
  } catch (err) {
    next(err);
  }
};

exports.ajouter = async (req, res, next) => {
  try {
    const { produitId, quantite = 1 } = req.body;

    if (!produitId) {
      return error(res, 'L\'ID du produit est requis.', 400);
    }

    const produit = await Produit.findById(produitId);
    if (!produit) {
      return error(res, 'Produit non trouvé.', 404);
    }
    if (produit.stock < quantite) {
      return error(res, 'Stock insuffisant.', 400);
    }

    let panier = await Panier.findOne({ utilisateur: req.user._id });
    if (!panier) {
      panier = new Panier({ utilisateur: req.user._id, lignes: [] });
    }

    const ligneExistante = panier.lignes.find(
      l => l.produit.toString() === produitId
    );

    if (ligneExistante) {
      ligneExistante.quantite += quantite;
      ligneExistante.prix_unitaire = produit.prix;
    } else {
      panier.lignes.push({
        produit: produitId,
        quantite,
        prix_unitaire: produit.prix
      });
    }

    await panier.save();

    panier = await Panier.findById(panier._id).populate('lignes.produit');
    success(res, panier, 'Produit ajouté au panier');
  } catch (err) {
    next(err);
  }
};

exports.modifierQuantite = async (req, res, next) => {
  try {
    const { ligneId } = req.params;
    const { quantite } = req.body;

    if (!quantite || quantite < 1) {
      return error(res, 'Quantité invalide.', 400);
    }

    const panier = await Panier.findOne({ utilisateur: req.user._id });
    if (!panier) {
      return error(res, 'Panier non trouvé.', 404);
    }

    const ligne = panier.lignes.id(ligneId);
    if (!ligne) {
      return error(res, 'Ligne non trouvée dans le panier.', 404);
    }

    const produit = await Produit.findById(ligne.produit);
    if (produit && produit.stock < quantite) {
      return error(res, 'Stock insuffisant.', 400);
    }

    ligne.quantite = quantite;
    await panier.save();

    const panierMisAJour = await Panier.findById(panier._id).populate('lignes.produit');
    success(res, panierMisAJour, 'Quantité modifiée');
  } catch (err) {
    next(err);
  }
};

exports.supprimerLigne = async (req, res, next) => {
  try {
    const { ligneId } = req.params;
    const panier = await Panier.findOne({ utilisateur: req.user._id });

    if (!panier) {
      return error(res, 'Panier non trouvé.', 404);
    }

    panier.lignes = panier.lignes.filter(l => l._id.toString() !== ligneId);
    await panier.save();

    const panierMisAJour = await Panier.findById(panier._id).populate('lignes.produit');
    success(res, panierMisAJour, 'Ligne supprimée du panier');
  } catch (err) {
    next(err);
  }
};

exports.vider = async (req, res, next) => {
  try {
    const panier = await Panier.findOne({ utilisateur: req.user._id });
    if (!panier) {
      return error(res, 'Panier non trouvé.', 404);
    }

    panier.lignes = [];
    await panier.save();
    success(res, panier, 'Panier vidé');
  } catch (err) {
    next(err);
  }
};
