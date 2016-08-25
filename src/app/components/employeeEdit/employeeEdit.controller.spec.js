(function() {
  'use strict';

  describe('EmployeeEditCtrl', function(){
    var $controller, $httpBackend, $rootScope, createController;
    beforeEach(module('manager'));
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $rootScope = $injector.get('$rootScope');

      createController = function(scope, client) {
       return $controller('EmployeeEditCtrl', {$scope : scope});
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
})();
