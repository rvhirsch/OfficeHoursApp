'use strict';

// Hours controller
angular.module('hours').controller('HoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hours',
  function ($scope, $stateParams, $location, Authentication, Hours) {
    $scope.authentication = Authentication;

    // Create new Hour
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'hourForm');

        return false;
      }

      // Create new Hour object
      var hour = new Hours({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      hour.$save(function (response) {
        $location.path('hours/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Hour
    $scope.remove = function (hour) {
      if (hour) {
        hour.$remove();

        for (var i in $scope.hours) {
          if ($scope.hours[i] === hour) {
            $scope.hours.splice(i, 1);
          }
        }
      } else {
        $scope.hour.$remove(function () {
          $location.path('hours');
        });
      }
    };

    // Update existing Hour
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'hourForm');

        return false;
      }

      var hour = $scope.hour;

      hour.$update(function () {
        $location.path('hours/' + hour._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Hours
    $scope.find = function () {
      $scope.hours = Hours.query();
    };

    // Find existing Hour
    $scope.findOne = function () {
      $scope.hour = Hours.get({
        hourId: $stateParams.hourId
      });
    };
  }
]);
