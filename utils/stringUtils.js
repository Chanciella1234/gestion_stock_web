const echapperRegex = (chaine) => {
  return chaine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = { echapperRegex };