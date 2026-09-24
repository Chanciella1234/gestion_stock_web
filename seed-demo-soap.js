require('dotenv').config();
const mongoose = require('mongoose');
const Produit = require('./models/Produit');
const Categorie = require('./models/Categorie');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecté à MongoDB');

  let categorie = await Categorie.findOne({ nom: 'Alimentation' });
  if (!categorie) {
    categorie = await Categorie.create({ nom: 'Alimentation' });
    console.log('Catégorie "Alimentation" créée');
  }

  const produitsDemo = [
    { nom: 'Riz parfume 5kg (sac)', description: 'Riz parfumé, sac de 5kg', prix: 20000, stock: 50, categorie: categorie._id },
    { nom: 'Haricots rouges 1kg (paquet)', description: 'Haricots rouges, paquet de 1kg', prix: 5000, stock: 100, categorie: categorie._id },
    { nom: 'Huile vegetale 5L (bidon)', description: 'Huile végétale, bidon de 5L', prix: 30000, stock: 30, categorie: categorie._id },
  ];

  for (const p of produitsDemo) {
    const existant = await Produit.findOne({ nom: p.nom });
    if (existant) {
      console.log(`Déjà présent, ignoré : ${p.nom}`);
      continue;
    }
    const created = await Produit.create(p);
    console.log(`Créé : ${created.nom} (id ${created._id})`);
  }

  await mongoose.disconnect();
  console.log('Terminé.');
}

run().catch((err) => {
  console.error('Erreur:', err);
  process.exit(1);
});