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
        templateUrl: 'modules/hours/client/views/create-hour.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('hours.view', {
        url: '/:hourId',
        templateUrl: 'modules/hours/client/views/view-hour.client.view.html'
      })
      .state('hours.edit', {
        url: '/:hourId/edit',
        templateUrl: 'modules/hours/client/views/edit-hour.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
