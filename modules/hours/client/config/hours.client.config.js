'use strict';

// Configuring the Hours module
angular.module('hours').run(['Menus',
  function (Menus) {
    // Add the hours dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Hours',
      state: 'hours',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'hours', {
      title: 'List Hours',
      state: 'hours.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'hours', {
      title: 'Create Hours',
      state: 'hours.create',
      roles: ['user']
    });
  }
]);
