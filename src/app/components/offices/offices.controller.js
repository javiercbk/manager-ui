(function() {
  'use strict';

  angular.module('manager').
  controller('OfficesCtrl', ['$scope', '$uibModal', 'Office', OfficesCtrl]);

  /** @ngInject */
  function OfficesCtrl($scope, $uibModal, Office) {
    $scope.offices = Office.query();

    $scope.delete = function(officeId, index){
      Office.delete({id: officeId}).$promise.then(function(office) {
        //update scope
      }).catch(function(){
        $scope.offices[index].deleting = false;
      });
      $scope.offices[index].deleting = true;
    };

    $scope.openOfficeModal = function(office, index){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/app/components/officeEdit/officeEdit.html',
        controller: 'OfficeEditCtrl',
        size: 'lg',
        resolve: {
          office: function() {
            return angular.copy(office);
          }
        }
      });

      modalInstance.result.then(function(officeCommand) {
        if(officeCommand.save){
          if(officeCommand.office.id){
            var oldOffice = $scope.offices[index];
            Office.update({id: officeCommand.office.id }, officeCommand.patches).$promise.catch(function(){
              $scope.offices[index] = oldOffice;
            }).finally(function(){
              $scope.offices[index].updating = false;
            });
            officeCommand.office.updating = true
            $scope.offices[index] = officeCommand.office;
          }else{
            $scope.offices.push(officeCommand.office);
            var newIndex = $scope.offices.length - 1;
            Office.save(officeCommand.office).$promise.then(function(createdOffice){
              $scope.offices[newIndex] = createdOffice;
            }).catch(function(){
              $scope.offices.splice(newIndex, 1);
            });
          }
        }else if(officeCommand.delete){
          $scope.delete(officeCommand.office.id, index);
        }
      });
    };

    $scope.delete = function(officeId, index) {
      Office.delete({id: officeId}).$promise.then(function() {
        $scope.offices.splice(index, 1);
      }).catch(function() {
        $scope.offices[index].deleting = false;
      });
      $scope.offices[index].deleting = true;
    };
  }
})();
