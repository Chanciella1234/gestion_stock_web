const Notification = require('../models/Notification');
const { success, error } = require('../utils/apiResponse');

exports.liste = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ utilisateur: req.user._id })
      .sort('-createdAt');
    success(res, notifications);
  } catch (err) {
    next(err);
  }
};

exports.marquerLue = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, utilisateur: req.user._id },
      { lu: true },
      { new: true }
    );

    if (!notification) {
      return error(res, 'Notification non trouvée.', 404);
    }

    success(res, notification, 'Notification marquée comme lue');
  } catch (err) {
    next(err);
  }
};
