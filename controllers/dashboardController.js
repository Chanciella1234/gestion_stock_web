const Commande = require('../models/Commande');
const Produit = require('../models/Produit');
const Alerte = require('../models/Alerte');
const Utilisateur = require('../models/Utilisateur');
const { success } = require('../utils/apiResponse');

exports.stats = async (req, res, next) => {
  try {
    const [
      totalCommandes,
      commandesParStatut,
      chiffreAffaires,
      produitsVendus,
      totalProduits,
      alertesActives,
      totalClients,
      produitsFaibleStock
    ] = await Promise.all([
      Commande.countDocuments(),
      Commande.aggregate([
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),
      Commande.aggregate([
        { $match: { statut: { $ne: 'annulee' } } },
        { $group: { _id: null, total: { $sum: '$montant_total' } } }
      ]),
      Commande.aggregate([
        { $unwind: '$lignes' },
        { $group: { _id: null, total: { $sum: '$lignes.quantite' } } }
      ]),
      Produit.countDocuments(),
      Alerte.countDocuments({ resolu: false }),
      Utilisateur.countDocuments({ role: 'client' }),
      Produit.find({ alerte_active: true }).select('nom stock seuil_alerte').sort('stock')
    ]);

    success(res, {
      commandes: {
        total: totalCommandes,
        parStatut: commandesParStatut.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      chiffreAffaires: chiffreAffaires.length > 0 ? chiffreAffaires[0].total : 0,
      produitsVendus: produitsVendus.length > 0 ? produitsVendus[0].total : 0,
      stock: {
        totalProduits,
        alerteActive: alertesActives,
        produitsFaibleStock
      },
      clients: totalClients
    });
  } catch (err) {
    next(err);
  }
};
