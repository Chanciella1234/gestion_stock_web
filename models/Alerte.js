const mongoose = require('mongoose');

const alerteSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true
  },
  type: {
    type: String,
    enum: ['stock_faible', 'rupture'],
    default: 'stock_faible'
  },
  resolu: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'alertes'
});

module.exports = mongoose.model('Alerte', alerteSchema);
