const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  note: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note minimale est 1'],
    max: [5, 'La note maximale est 5']
  },
  commentaire: {
    type: String,
    trim: true,
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  },
  valide: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'avis'
});

avisSchema.index({ produit: 1, utilisateur: 1 }, { unique: true });

module.exports = mongoose.model('Avis', avisSchema);
