(function() {
  'use strict';

  describe('MenuNavCtrl', function(){
    var $controller, $scope, $location, createController;
    beforeEach(module('manager'));
    beforeEach(inject(function($injector) {
      $location = $injector.get('$location');
      $controller = $injector.get('$controller');
      createController = function(scope) {
       return $controller('MenuNavCtrl', {'$scope' : scope});
      };
    }));

    it('it should know if a location is active', function() {
      var $scope = {};
      var cec = createController($scope);
      $location.path('/clients');
      expect($scope.isActive('/clients')).toBeTruthy();
    });

    it('it should know if a location is active even if there are query parameters', function() {
      var $scope = {};
      var cec = createController($scope);
      $location.path('/clients?order=name');
      expect($scope.isActive('/clients')).toBeTruthy();
    });

    it('it should know if a location is inactive', function() {
      var $scope = {};
      var cec = createController($scope);
      $location.path('/clients');
      expect($scope.isActive('/employees')).toBeFalsy();
    });
  });
})();
