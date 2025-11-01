const { ROLES } = require('../config/constants');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

const isSupport = (req, res, next) => {
  if (!req.user || (req.user.role !== ROLES.SUPPORT && req.user.role !== ROLES.ADMIN)) {
    return res.status(403).json({
      success: false,
      message: 'Support staff access required'
    });
  }
  next();
};

const isTraveler = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.TRAVELER) {
    return res.status(403).json({
      success: false,
      message: 'Traveler access required'
    });
  }
  next();
};

const isOwnerOrAdmin = (modelName, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const Model = require('../models')[modelName];
      const resource = await Model.findByPk(req.params[idParam]);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${modelName} not found`
        });
      }

      // Check if user is admin or owner
      const isOwner = resource.userId && resource.userId === req.user.id;
      const isAdmin = req.user.role === ROLES.ADMIN;

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to perform this action'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error checking authorization'
      });
    }
  };
};

module.exports = {
  authorize,
  isAdmin,
  isSupport,
  isTraveler,
  isOwnerOrAdmin
};