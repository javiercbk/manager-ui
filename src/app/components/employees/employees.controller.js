(function() {
  'use strict';

  angular.module('manager').
  controller('EmployeesCtrl', ['$scope', '$uibModal', 'Employee', EmployeesCtrl]);

  /** @ngInject */
  function EmployeesCtrl($scope, $uibModal, Employee) {
    $scope.employees = Employee.query();

    $scope.delete = function(employeeId, index){
      Employee.delete({id: employeeId}).$promise.catch(function(){
        $scope.employees[index].deleting = false;
      });
      $scope.employees[index].deleting = true;
    };

    $scope.openEmployeeModal = function(employee, index){

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/app/components/employeeEdit/employeeEdit.html',
        controller: 'EmployeeEditCtrl',
        size: 'lg',
        resolve: {
          employee: function() {
            return angular.copy(employee);
          }
        }
      });

      modalInstance.result.then(function(employeeCommand) {
        if(employeeCommand.save){
          if(employeeCommand.employee.id){
            var oldEmployee = $scope.employees[index];
            Employee.update({id: employeeCommand.employee.id }, employeeCommand.patches).$promise.catch(function(){
              $scope.employees[index] = oldEmployee;
            }).finally(function(){
              $scope.employees[index].updating = false;
            });
            employeeCommand.employee.updating = true
            $scope.employees[index] = employeeCommand.employee;
          }else{
            var newEmployee = angular.copy(employeeCommand.employee);
            newEmployee.office = employeeCommand.employee.office.id
            $scope.employees.push(employeeCommand.employee);
            var newIndex = $scope.employees.length - 1;
            Employee.save(newEmployee).$promise.then(function(createdEmployee){
              $scope.employees[newIndex] = createdEmployee;
            }).catch(function(){
              $scope.employees.splice(newIndex, 1);
            });
          }
        }else if(employeeCommand.delete){
          $scope.delete(employeeCommand.employee.id, index);
        }
      });
    };

    $scope.delete = function(employeeId, index) {
      Employee.remove({id: employeeId}).$promise.then(function() {
        $scope.employees.splice(index, 1);
      }).catch(function() {
        $scope.employees[index].deleting = false;
      });
      $scope.employees[index].deleting = true;
    };
  }
})();
