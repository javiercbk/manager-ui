(function() {
  'use strict';

  angular.module('manager').
  controller('MenuNavCtrl', ['$scope','$location', MenuNavCtrl]);

  /** @ngInject */
  function MenuNavCtrl($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) == 0
    };
  }
})();
