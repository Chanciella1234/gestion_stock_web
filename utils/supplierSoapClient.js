const soap = require('soap');

const WSDL_URL = process.env.SUPPLIER_SOAP_WSDL_URL
  || 'http://localhost:8080/ws/mon-service.wsdl';

let cachedClient = null;

async function getClient() {
  if (!cachedClient) {
    cachedClient = await soap.createClientAsync(WSDL_URL);
  }
  return cachedClient;
}

async function fetchSupplierCatalog(supplierId) {
  try {
    const client = await getClient();
    const [result] = await client.getSupplierCatalogAndPricingAsync({ supplierId });
    const products = Array.isArray(result.product)
      ? result.product
      : (result.product ? [result.product] : []);

    return {
      supplierCode: result.supplierCode,
      companyName: result.companyName,
      products: products.map((p) => ({
        sku: p.sku,
        productName: p.productName,
        wholesalePrice: parseFloat(p.wholesalePrice),
        leadTimeDays: parseInt(p.leadTimeDays, 10),
        supplierStockLevel: parseInt(p.supplierStockLevel, 10),
      })),
    };
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
      throw { code: 'SUPPLIER_SERVICE_DOWN', message: 'Service fournisseur (SOAP) indisponible.' };
    }
    if (err.root?.Envelope?.Body?.Fault) {
      const fault = err.root.Envelope.Body.Fault;
      const rawMessage = fault.faultstring;
      const message = typeof rawMessage === 'string'
        ? rawMessage
        : (rawMessage?.$value || 'Fournisseur introuvable');
      throw { code: 'SUPPLIER_NOT_FOUND', message };
    }
    throw { code: 'SOAP_ERROR', message: err.message || 'Erreur SOAP inconnue' };
  }
}

module.exports = { fetchSupplierCatalog };