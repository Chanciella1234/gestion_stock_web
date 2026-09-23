const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/database');
const Produit = require('./models/Produit');
const { synchroniser } = require('./controllers/supplierSyncController');

const resMock = {
  _status: null,
  _data: null,
  status(code) {
    this._status = code;
    return this;
  },
  json(data) {
    this._data = data;
    return this;
  }
};

async function main() {
  const supplierId = process.argv[2] ? parseInt(process.argv[2], 10) : 1;

  await connectDB();

  console.log(`Appel synchroniser(supplierId=${supplierId}) via le controller...`);
  await synchroniser(
    { params: { supplierId: String(supplierId) } },
    resMock,
    (err) => {
      console.log('=== next(err) appelé (erreur non gérée par le controller) ===');
      console.log(err);
    }
  );

  console.log('=== RÉPONSE DU CONTROLLER ===');
  console.log('HTTP', resMock._status);
  console.log(JSON.stringify(resMock._data, null, 2));

  if (resMock._status === 200 && resMock._data?.data?.fournisseur) {
    const code = resMock._data.data.fournisseur.code;
    console.log(`=== VÉRIFICATION MONGODB (produits fournisseur_code="${code}") ===`);
    const produits = await Produit.find({ fournisseur_code: code }).select(
      'nom sku prix_achat delai_livraison_jours stock_fournisseur fournisseur_nom derniere_synchro_fournisseur'
    ).lean();
    if (produits.length === 0) {
      console.log('Aucun produit trouvé avec ce fournisseur_code en base.');
    } else {
      produits.forEach((p) => console.log(JSON.stringify(p, null, 2)));
    }
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur du script :', err);
  process.exit(1);
});