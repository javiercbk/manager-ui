(function() {
  'use strict';

  angular.module('manager').config(['$routeProvider', routeConfig]);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/main/main.html'
      })
      .when('/clients',{
        templateUrl: 'app/components/clients/clients.html',
        controller: 'ClientsCtrl',
        controllerAs: 'ClientsCtrl'
      })
      .when('/clients/:id',{
        templateUrl: 'app/components/clientEdit/clientEdit.html',
        controller: 'ClientEditCtrl',
        controllerAs: 'ClientEditCtrl'
      })
      .when('/offices', {
        templateUrl: 'app/components/offices/offices.html',
        controller: 'OfficesCtrl',
        controllerAs: 'OfficesCtrl'
      })
      .when('/employees', {
        templateUrl: 'app/components/employees/employees.html',
        controller: 'EmployeesCtrl',
        controllerAs: 'EmployeesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
