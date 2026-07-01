const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/views', express.static('views'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/produits', require('./routes/produitRoutes'));
app.use('/api/categories', require('./routes/categorieRoutes'));
app.use('/api/panier', require('./routes/panierRoutes'));
app.use('/api/commandes', require('./routes/commandeRoutes'));
app.use('/api/alertes', require('./routes/alerteRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/avis', require('./routes/avisRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'views' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const demarrer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

demarrer();
// Maintenu par NIYURUKUNDO Methode
// Maintenu par NIYURUKUNDO Methode
// Maintenu par NIYURUKUNDO Methode
