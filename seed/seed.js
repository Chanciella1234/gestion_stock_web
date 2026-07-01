const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  Utilisateur,
  Categorie,
  Produit,
  Panier,
  Commande,
  Alerte,
  Notification,
  Avis,
  Promotion
} = require('../models');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB pour le seed...');

    await Promise.all([
      Utilisateur.deleteMany({}),
      Categorie.deleteMany({}),
      Produit.deleteMany({}),
      Panier.deleteMany({}),
      Commande.deleteMany({}),
      Alerte.deleteMany({}),
      Notification.deleteMany({}),
      Avis.deleteMany({}),
      Promotion.deleteMany({})
    ]);
    console.log('Anciennes données supprimées.');

    const admin = await Utilisateur.create({
      nom: 'Admin Stock',
      email: 'admin@stock.com',
      mot_de_passe: 'admin123',
      role: 'admin'
    });

    const [chanciella, nice, methode] = await Utilisateur.create([
      { nom: 'ITERITEKA Ange Chanciella', email: 'chanciella@gmail.com', mot_de_passe: 'chanciella123', role: 'client' },
      { nom: 'NSABIYUMVA Nice Stella', email: 'nice@gmail.com', mot_de_passe: 'nice123', role: 'client' },
      { nom: 'NIYURUKUNDO Methode', email: 'methode@gmail.com', mot_de_passe: 'methode123', role: 'client' }
    ]);
    console.log('Utilisateurs créés.');

    const categories = await Categorie.create([
      { nom: 'Électronique', description: 'Appareils électroniques et accessoires' },
      { nom: 'Vêtements', description: 'Vêtements homme, femme et enfant' },
      { nom: 'Alimentation', description: 'Produits alimentaires et boissons' },
      { nom: 'Maison', description: 'Meubles, décoration et électroménager' },
      { nom: 'Sports', description: 'Équipements et accessoires de sport' }
    ]);
    console.log('Catégories créées.');

    const [catElectronique, catVetements, catAlimentation, catMaison, catSports] = categories;

    const produits = await Produit.create([
      { nom: 'Casque Bluetooth Sony', description: 'Casque sans fil à réduction de bruit active', prix: 89.99, stock: 25, seuil_alerte: 5, categorie: catElectronique._id },
      { nom: 'Clavier Mécanique RGB', description: 'Clavier gaming avec switches Cherry MX', prix: 59.99, stock: 2, seuil_alerte: 5, categorie: catElectronique._id },
      { nom: 'T-shirt Coton Bio', description: 'T-shirt unisexe en coton biologique', prix: 19.99, stock: 50, seuil_alerte: 10, categorie: catVetements._id },
      { nom: 'Jean Slim Noir', description: 'Jean slim fit noir taille élastique', prix: 39.99, stock: 30, seuil_alerte: 10, categorie: catVetements._id },
      { nom: 'Huile d\'Olive Extra Vierge 1L', description: 'Huile d\'olive italienne première pression à froid', prix: 12.99, stock: 0, seuil_alerte: 10, categorie: catAlimentation._id },
      { nom: 'Café Arabica 250g', description: 'Café en grains d\'Éthiopie, torréfaction moyenne', prix: 8.99, stock: 20, seuil_alerte: 5, categorie: catAlimentation._id },
      { nom: 'Lampe de Bureau LED', description: 'Lampe design avec intensité réglable', prix: 34.99, stock: 15, seuil_alerte: 5, categorie: catMaison._id },
      { nom: 'Set de Couteaux 5 pièces', description: 'Couteaux inoxydable avec bloc en bois', prix: 49.99, stock: 1, seuil_alerte: 3, categorie: catMaison._id },
      { nom: 'Tapis de Yoga', description: 'Tapis antidérapant 6mm avec sangle de transport', prix: 24.99, stock: 40, seuil_alerte: 10, categorie: catSports._id },
      { nom: 'Haltères Réglables 20kg', description: 'Paire d\'haltères réglables en fonte', prix: 79.99, stock: 8, seuil_alerte: 5, categorie: catSports._id },
      { nom: 'Montre Connectée', description: 'Montre fitness avec GPS et cardio', prix: 149.99, stock: 4, seuil_alerte: 5, categorie: catElectronique._id },
      { nom: 'Veste Imperméable', description: 'Veste coupe-vent avec capuche amovible', prix: 69.99, stock: 3, seuil_alerte: 5, categorie: catVetements._id },
      { nom: 'Pâtes Artisanales 500g', description: 'Pâtes de semoule de blé dur, 3 saveurs', prix: 3.99, stock: 60, seuil_alerte: 15, categorie: catAlimentation._id },
      { nom: 'Coussin Décoratif 45x45', description: 'Coussin en velours avec rembourrage mémoire de forme', prix: 14.99, stock: 2, seuil_alerte: 5, categorie: catMaison._id }
    ]);
    console.log('Produits créés.');

    const [
      casque, clavier, tshirt, jeanProduit, huile, cafe, lampe, couteaux,
      tapis, halteres, montre, veste, pates, coussin
    ] = produits;

    await Alerte.create([
      { produit: clavier._id, message: `Stock faible pour "${clavier.nom}" : ${clavier.stock} unité(s) restante(s)`, type: 'stock_faible' },
      { produit: huile._id, message: `Rupture de stock pour "${huile.nom}"`, type: 'rupture' },
      { produit: couteaux._id, message: `Stock faible pour "${couteaux.nom}" : ${couteaux.stock} unité(s) restante(s)`, type: 'stock_faible' },
      { produit: montre._id, message: `Stock faible pour "${montre.nom}" : ${montre.stock} unité(s) restante(s)`, type: 'stock_faible' },
      { produit: veste._id, message: `Stock faible pour "${veste.nom}" : ${veste.stock} unité(s) restante(s)`, type: 'stock_faible' },
      { produit: coussin._id, message: `Stock faible pour "${coussin.nom}" : ${coussin.stock} unité(s) restante(s)`, type: 'stock_faible' }
    ]);
    console.log('Alertes créées.');

    await Notification.create([
      { utilisateur: chanciella._id, message: 'Bienvenue sur Gestion Stock ! Découvrez nos nouveaux produits.', type: 'info' },
      { utilisateur: nice._id, message: 'Bienvenue sur Gestion Stock ! Découvrez nos nouveaux produits.', type: 'info' },
      { utilisateur: methode._id, message: 'Bienvenue sur Gestion Stock ! Découvrez nos nouveaux produits.', type: 'info' },
      { utilisateur: admin._id, message: '6 alertes de stock sont actives. Vérifiez le tableau de bord.', type: 'alerte' },
      { utilisateur: chanciella._id, message: 'Votre commande #CMD001 a été payée avec succès.', type: 'commande' },
      { utilisateur: nice._id, message: 'Promotion : -20% sur tous les accessoires électroniques ce mois-ci !', type: 'promotion' }
    ]);
    console.log('Notifications créées.');

    const commande1 = await Commande.create({
      utilisateur: chanciella._id,
      lignes: [
        { produit: casque._id, nom_produit: casque.nom, quantite: 1, prix_unitaire: casque.prix },
        { produit: tapis._id, nom_produit: tapis.nom, quantite: 1, prix_unitaire: tapis.prix }
      ],
      montant_total: casque.prix + tapis.prix,
      statut: 'livree'
    });

    const commande2 = await Commande.create({
      utilisateur: nice._id,
      lignes: [
        { produit: tshirt._id, nom_produit: tshirt.nom, quantite: 2, prix_unitaire: tshirt.prix },
        { produit: jeanProduit._id, nom_produit: jeanProduit.nom, quantite: 1, prix_unitaire: jeanProduit.prix }
      ],
      montant_total: 2 * tshirt.prix + jeanProduit.prix,
      statut: 'expediee'
    });

    const commande3 = await Commande.create({
      utilisateur: chanciella._id,
      lignes: [
        { produit: cafe._id, nom_produit: cafe.nom, quantite: 3, prix_unitaire: cafe.prix }
      ],
      montant_total: 3 * cafe.prix,
      statut: 'confirmee'
    });

    const commande4 = await Commande.create({
      utilisateur: chanciella._id,
      lignes: [
        { produit: halteres._id, nom_produit: halteres.nom, quantite: 1, prix_unitaire: halteres.prix },
        { produit: lampe._id, nom_produit: lampe.nom, quantite: 1, prix_unitaire: lampe.prix }
      ],
      montant_total: halteres.prix + lampe.prix,
      statut: 'en_attente'
    });
    console.log('Commandes créées.');

    await Avis.create([
      { utilisateur: chanciella._id, produit: casque._id, note: 5, commentaire: 'Excellent casque, le son est incroyable !', valide: true },
      { utilisateur: chanciella._id, produit: tapis._id, note: 4, commentaire: 'Bon tapis, confortable pour le yoga.', valide: true },
      { utilisateur: nice._id, produit: tshirt._id, note: 5, commentaire: 'Très doux et belle coupe.', valide: true },
      { utilisateur: nice._id, produit: jeanProduit._id, note: 3, commentaire: 'Bon jean mais taille un peu grand.', valide: false },
      { utilisateur: chanciella._id, produit: cafe._id, note: 5, commentaire: 'Meilleur café que j\'ai jamais goûté !', valide: true }
    ]);
    console.log('Avis créés.');

    await Promotion.create([
      {
        code: 'BIENVENUE10',
        type: 'pourcentage',
        valeur: 10,
        date_debut: new Date('2026-01-01'),
        date_fin: new Date('2026-12-31'),
        actif: true,
        categories_applicables: []
      },
      {
        code: 'ELECTRONIC20',
        type: 'pourcentage',
        valeur: 20,
        date_debut: new Date('2026-06-01'),
        date_fin: new Date('2026-07-31'),
        actif: true,
        categories_applicables: [catElectronique._id]
      },
      {
        code: 'SPORT5',
        type: 'montant_fixe',
        valeur: 5,
        date_debut: new Date('2026-06-01'),
        date_fin: new Date('2026-08-31'),
        actif: true,
        produits_applicables: [tapis._id, halteres._id]
      },
      {
        code: 'EXPIRE',
        type: 'pourcentage',
        valeur: 15,
        date_debut: new Date('2025-01-01'),
        date_fin: new Date('2025-12-31'),
        actif: true,
        categories_applicables: []
      }
    ]);
    console.log('Promotions créées.');

    console.log('\n✓ Seed terminé avec succès !');
    console.log('  Admin  : admin@stock.com / admin123');
    console.log('  Client : chanciella@gmail.com / chanciella123');
    console.log('  Client : nice@gmail.com / nice123');
    console.log('  Client : methode@gmail.com / methode123');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  }
};

seedDB();
