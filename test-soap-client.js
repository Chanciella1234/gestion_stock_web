const { fetchSupplierCatalog } = require('./utils/supplierSoapClient');

async function main() {
  const supplierId = process.argv[2] ? parseInt(process.argv[2], 10) : 1;

  console.log(`Appel SOAP getSupplierCatalogAndPricing pour supplierId = ${supplierId}...`);

  try {
    const result = await fetchSupplierCatalog(supplierId);
    console.log('=== SUCCÈS ===');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.log('=== ERREUR ===');
    switch (err.code) {
      case 'SUPPLIER_SERVICE_DOWN':
        console.log('Service fournisseur (SOAP) indisponible. Vérifie que le Spring Boot (legacy-supplier-portal) est démarré sur le port 8080.');
        break;
      case 'SUPPLIER_NOT_FOUND':
        console.log(`Fournisseur introuvable (supplierId=${supplierId}). Le <soap:Fault> a bien été intercepté et transformé.`);
        break;
      case 'SOAP_ERROR':
        console.log('Erreur SOAP inconnue :', err.message);
        break;
      default:
        console.log('Erreur inattendue :', err);
    }
    console.log('Détail technique :', JSON.stringify(err, null, 2));
  }
}

main();