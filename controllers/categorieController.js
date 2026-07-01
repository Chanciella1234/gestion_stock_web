const Categorie = require('../models/Categorie');
const { success, error } = require('../utils/apiResponse');

exports.liste = async (req, res, next) => {
  try {
    const categories = await Categorie.find().sort('nom');
    success(res, categories);
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) {
      return error(res, 'Catégorie non trouvée.', 404);
    }
    success(res, categorie);
  } catch (err) {
    next(err);
  }
};

exports.creer = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    if (!nom) {
      return error(res, 'Le nom de la catégorie est requis.', 400);
    }
    const categorie = await Categorie.create({ nom, description });
    success(res, categorie, 'Catégorie créée', 201);
  } catch (err) {
    next(err);
  }
};

exports.modifier = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    const categorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true, runValidators: true }
    );
    if (!categorie) {
      return error(res, 'Catégorie non trouvée.', 404);
    }
    success(res, categorie, 'Catégorie modifiée');
  } catch (err) {
    next(err);
  }
};

exports.supprimer = async (req, res, next) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!categorie) {
      return error(res, 'Catégorie non trouvée.', 404);
    }
    success(res, null, 'Catégorie supprimée');
  } catch (err) {
    next(err);
  }
};
