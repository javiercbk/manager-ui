(function() {
  'use strict';

  angular.module('manager').
  controller('EmployeeEditCtrl', ['$scope', '$uibModalInstance', 'employee', 'Office', 'addressablePatches', EmployeeEditCtrl]);

  /** @ngInject */
  function EmployeeEditCtrl($scope, $uibModalInstance, employee, Office, addressablePatches) {
    $scope.employee = employee;
    if(!$scope.employee){
      $scope.employee = {};
    }
    $scope.title = $scope.employee.id? 'Edit employee "'+$scope.employee.name+'"': 'New employee';
    $scope.providers = null;
    $scope.office = '';

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function(){
      if ($scope.employeeForm.$invalid) {
        return;
      }
      var closeMsg = {save: true, employee: $scope.employee};
      if($scope.employee.id){
        closeMsg.patches = buildPatchOperations($scope);
      }
      $uibModalInstance.close(closeMsg);
    };

    $scope.searchOffices = function(location){
      return Office.query({location: location}).$promise;
    };

    $scope.delete = function(){
      $uibModalInstance.close({delete: true, employee: $scope.employee});
    };

    $scope.wokingSincePicker = {
      opened: false
    };

    $scope.wokingSinceOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    $scope.wokingSincePickerOpen = function() {
      $scope.wokingSincePicker.opened = true;
    };

    var buildPatchOperations = function($scope){
      var patches = addressablePatches($scope, 'employee');
      patches.push({op:'replace', path: '/office', value:$scope.employee.office.id});
      return {patches: patches};
    };
  }
})();
