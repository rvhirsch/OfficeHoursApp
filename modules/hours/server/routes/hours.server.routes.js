'use strict';

/**
 * Module dependencies.
 */
var hoursPolicy = require('../policies/hours.server.policy'),
  hours = require('../controllers/hours.server.controller');

module.exports = function (app) {
  // Hours collection routes
  app.route('/api/hours').all(hoursPolicy.isAllowed)
    .get(hours.list)
    .post(hours.create);

  // Single hour routes
  app.route('/api/hours/:hourId').all(hoursPolicy.isAllowed)
    .get(hours.read)
    .put(hours.update)
    .delete(hours.delete);

  // Finish by binding the hour middleware
  app.param('hourId', hours.hourByID);
};
