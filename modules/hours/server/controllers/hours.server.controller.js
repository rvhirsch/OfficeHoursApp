'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hour = mongoose.model('Hour'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a hour
 */
exports.create = function (req, res) {
  var hour = new Hour(req.body);
  hour.user = req.user;

  hour.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hour);
    }
  });
};

/**
 * Show the current hour
 */
exports.read = function (req, res) {
  res.json(req.hour);
};

/**
 * Update a hour
 */
exports.update = function (req, res) {
  var hour = req.hour;

  hour.title = req.body.title;
  hour.content = req.body.content;
  hour.classesTaught = req.body.classesTaught;
  hour.office = req.body.office;

  hour.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hour);
    }
  });
};

/**
 * Delete an hour
 */
exports.delete = function (req, res) {
  var hour = req.hour;

  hour.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hour);
    }
  });
};

/**
 * List of Hours
 */
exports.list = function (req, res) {
  Hour.find().sort('-created').populate('user', 'displayName').exec(function (err, hours) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hours);
    }
  });
};

/**
 * Hour middleware
 */
exports.hourByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hour is invalid'
    });
  }

  Hour.findById(id).populate('user', 'displayName').exec(function (err, hour) {
    if (err) {
      return next(err);
    } else if (!hour) {
      return res.status(404).send({
        message: 'No hour with that identifier has been found'
      });
    }
    req.hour = hour;
    next();
  });
};
