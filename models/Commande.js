const mongoose = require('mongoose');

const ligneCommandeSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  nom_produit: {
    type: String,
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1']
  },
  prix_unitaire: {
    type: Number,
    required: true,
    min: [0, 'Le prix unitaire ne peut pas être négatif']
  }
}, { _id: false });

const commandeSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  lignes: [ligneCommandeSchema],
  montant_total: {
    type: Number,
    required: true,
    min: [0, 'Le montant total ne peut pas être négatif']
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'expediee', 'livree', 'annulee'],
    default: 'en_attente'
  },
  historique_statuts: [{
    statut: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  code_promo_applique: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'commandes'
});

module.exports = mongoose.model('Commande', commandeSchema);
