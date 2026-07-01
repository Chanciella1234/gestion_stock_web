const mongoose = require('mongoose');

const lignePanierSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1'],
    default: 1
  },
  prix_unitaire: {
    type: Number,
    required: true,
    min: [0, 'Le prix unitaire ne peut pas être négatif']
  }
}, { _id: false });

const panierSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true,
    unique: true
  },
  lignes: [lignePanierSchema],
  expire_at: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true,
  collection: 'paniers'
});

panierSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

panierSchema.virtual('total').get(function () {
  return this.lignes.reduce((acc, ligne) => acc + ligne.prix_unitaire * ligne.quantite, 0);
});

panierSchema.set('toJSON', { virtuals: true });
panierSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Panier', panierSchema);
