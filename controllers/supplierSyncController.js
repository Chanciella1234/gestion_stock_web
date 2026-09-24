const Produit = require('../models/Produit');
const { fetchSupplierCatalog } = require('../utils/supplierSoapClient');
const { success, error } = require('../utils/apiResponse');
const { echapperRegex } = require('../utils/stringUtils');

exports.synchroniser = async (req, res, next) => {
  try {
    const supplierId = parseInt(req.params.supplierId, 10);
    const catalogue = await fetchSupplierCatalog(supplierId);

    const produitsMisAJour = [];
    const nonTrouves = [];

    for (const item of catalogue.products) {
      const produit = await Produit.findOne({
        nom: { $regex: `^${echapperRegex(item.productName)}$`, $options: 'i' }
      });

      if (!produit) {
        nonTrouves.push({ sku: item.sku, productName: item.productName });
        continue;
      }

      produit.sku = item.sku;
      produit.prix_achat = item.wholesalePrice;
      produit.delai_livraison_jours = item.leadTimeDays;
      produit.stock_fournisseur = item.supplierStockLevel;
      produit.fournisseur_code = catalogue.supplierCode;
      produit.fournisseur_nom = catalogue.companyName;
      produit.derniere_synchro_fournisseur = new Date();

      await produit.save();
      produitsMisAJour.push(produit);
    }

    return success(res, {
      fournisseur: {
        code: catalogue.supplierCode,
        nom: catalogue.companyName
      },
      produitsMisAJour,
      nonTrouves
    }, 'Synchronisation fournisseur terminée');
  } catch (err) {
    if (err.code === 'SUPPLIER_NOT_FOUND') {
      return error(res, err.message || 'Fournisseur introuvable', 404);
    }
    if (err.code === 'SUPPLIER_SERVICE_DOWN') {
      return error(res, err.message || 'Service fournisseur (SOAP) indisponible', 503);
    }
    if (err.code === 'SOAP_ERROR') {
      return error(res, err.message || 'Erreur SOAP', 502);
    }
    next(err);
  }
};