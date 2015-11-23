'use strict';

// Setting up route
angular.module('hours').config(['$stateProvider',
  function ($stateProvider) {
    // Hours state routing
    $stateProvider
      .state('hours', {
        abstract: true,
        url: '/hours',
        template: '<ui-view/>'
      })
      .state('hours.list', {
        url: '',
        templateUrl: 'modules/hours/client/views/list-hours.client.view.html'
      })
      .state('hours.create', {
        url: '/create',
        templateUrl: 'modules/hours/client/views/input-hours.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('hours.view', {
        url: '/:hourId',
        templateUrl: 'modules/hours/client/views/view-hours.client.view.html'
      })
      .state('hours.edit', {
        url: '/:hourId/edit',
        templateUrl: 'modules/hours/client/views/edit-hours.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
