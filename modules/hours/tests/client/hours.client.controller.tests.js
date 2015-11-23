'use strict';

(function () {
  // Hours Controller Spec
  describe('Hours Controller Tests', function () {
    // Initialize global variables
    var HoursController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Hours,
      mockHour;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Hours_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Hours = _Hours_;

      // create mock hour
      mockHour = new Hours({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Hour about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Hours controller.
      HoursController = $controller('HoursController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one hour object fetched from XHR', inject(function (Hours) {
      // Create a sample hours array that includes the new hour
      var sampleHours = [mockHour];

      // Set GET response
      $httpBackend.expectGET('api/hours').respond(sampleHours);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.hours).toEqualData(sampleHours);
    }));

    it('$scope.findOne() should create an array with one hour object fetched from XHR using a hourId URL parameter', inject(function (Hours) {
      // Set the URL parameter
      $stateParams.hourId = mockHour._id;

      // Set GET response
      $httpBackend.expectGET(/api\/hours\/([0-9a-fA-F]{24})$/).respond(mockHour);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.hour).toEqualData(mockHour);
    }));

    describe('$scope.create()', function () {
      var sampleHourPostData;

      beforeEach(function () {
        // Create a sample hour object
        sampleHourPostData = new Hours({
          title: 'An Hour about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Hour about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Hours) {
        // Set POST response
        $httpBackend.expectPOST('api/hours', sampleHourPostData).respond(mockHour);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the hour was created
        expect($location.path.calls.mostRecent().args[0]).toBe('hours/' + mockHour._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/hours', sampleHourPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock hour in scope
        scope.hour = mockHour;
      });

      it('should update a valid hour', inject(function (Hours) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/hours\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/hours/' + mockHour._id);
      }));

      it('should set scope.error to error response message', inject(function (Hours) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/hours\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(hour)', function () {
      beforeEach(function () {
        // Create new hours array and include the hour
        scope.hours = [mockHour, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/hours\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockHour);
      });

      it('should send a DELETE request with a valid hourId and remove the hour from the scope', inject(function (Hours) {
        expect(scope.hours.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.hour = mockHour;

        $httpBackend.expectDELETE(/api\/hours\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to hours', function () {
        expect($location.path).toHaveBeenCalledWith('hours');
      });
    });
  });
}());
