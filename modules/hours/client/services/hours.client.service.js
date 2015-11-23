'use strict';

//Hours service used for communicating with the hours REST endpoints
angular.module('hours').factory('Hours', ['$resource',
  function ($resource) {
    return $resource('api/hours/:hourId', {
      hourId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
