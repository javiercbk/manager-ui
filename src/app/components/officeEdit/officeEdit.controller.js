(function() {
  'use strict';

  angular.module('manager').
  controller('OfficeEditCtrl', ['$scope', '$uibModalInstance', 'office', 'Office', OfficeEditCtrl]);

  /** @ngInject */
  function OfficeEditCtrl($scope, $uibModalInstance, office, Office) {
    $scope.office = office;
    var isNew = false;
    if(!$scope.office){
      isNew = true;
      $scope.office = {
        name: '',
        opened: new Date()
      }
    }
    $scope.title = isNew? 'New office': 'Edit office "'+$scope.office.id+'"';

    $scope.openPicker = {
      opened: false
    };

    $scope.closePicker = {
      opened: false
    };

    $scope.openOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    $scope.$watch("office.opened", function(newOpened) {
      $scope.closeOptions.minDate = newOpened;
      if($scope.office.closed && $scope.office.closed.getTime() < newOpened.getTime()){
        $scope.office.closed = newOpened;
      }
    });

    $scope.closeOptions = {
      formatYear: 'yyyy',
      minDate: $scope.office.opened,
      startingDay: 1
    };

    $scope.pickOpen = function() {
      $scope.openPicker.opened = true;
    };

    $scope.pickClose = function() {
      $scope.closePicker.opened = true;
    };

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function(){
      if ($scope.officeForm.$invalid) {
        return;
      }
      var closeMsg = {save: true, office: $scope.office};
      if($scope.office.id){
        closeMsg.patches = buildPatchOperations($scope);
      }
      $uibModalInstance.close(closeMsg);
    };

    $scope.delete = function(){
      $uibModalInstance.close({delete: true, office: $scope.office});
    };

    var buildPatchOperations = function(scope){
      var patches = [
        {op: 'replace', path: '/location', value: scope.office.location.trim()},
        {op: 'replace', path: '/opened', value: moment(scope.office.opened).format('YYYY-MM-DD')}
      ];
      if(scope.office.closed){
        patches.push({op: 'replace', path: '/closed', value: moment(scope.office.closed).format('YYYY-MM-DD')});
      }else{
        patches.push({op: 'remove', path: '/closed'});
      }
      return {patches: patches};
    };
  }
})();
