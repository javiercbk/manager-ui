(function() {
  'use strict';

  angular.module('manager').
  controller('ClientsCtrl', ['$scope', '$uibModal', 'Client', ClientsCtrl]);

  /** @ngInject */
  function ClientsCtrl($scope, $uibModal, Client) {
    $scope.clients = Client.query();

    $scope.openClientModal = function(client, index){

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/app/components/clientEdit/clientEdit.html',
        controller: 'ClientEditCtrl',
        size: 'lg',
        resolve: {
          client: function() {
            return angular.copy(client);
          }
        }
      });

      modalInstance.result.then(function(clientCommand) {
        if(clientCommand.save){
          if(clientCommand.client.id){
            var oldClient = $scope.clients[index];
            Client.update({id: clientCommand.client.id }, clientCommand.patches).$promise.catch(function(){
              $scope.clients[index] = oldClient;
            }).finally(function(){
              $scope.clients[index].updating = false;
            });
            clientCommand.client.updating = true;
            $scope.clients[index] = clientCommand.client;
          }else{
            var newClient = angular.copy(clientCommand.client);
            var newProviders = [];
            var newProvidersLen = clientCommand.client.providers.length;
            for(var i = 0; i < newProvidersLen; i++){
              newProviders[i] = clientCommand.client.providers[i].id;
            }
            newClient.providers = newProviders;
            $scope.clients.push(clientCommand.client);
            var newIndex = $scope.clients.length - 1;
            Client.save(newClient).$promise.then(function(createdClient){
              $scope.clients[newIndex] = createdClient;
            }).catch(function(){
              $scope.clients.splice(newIndex, 1);
            });
          }
        }else if(clientCommand.delete){
          $scope.delete(clientCommand.client.id, index);
        }
      });
    };

    $scope.delete = function(clientId, index) {
      var deletedClient = $scope.clients.splice(index, 1)[0];
      Client.remove({id: clientId}).$promise.catch(function() {
        $scope.clients.splice(index, 1, deletedClient);
      });
    };
  }
})();
