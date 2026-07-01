const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'promotion', 'commande', 'alerte'],
    default: 'info'
  },
  lu: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'notifications'
});

module.exports = mongoose.model('Notification', notificationSchema);
