(function() {
  'use strict';

  angular.module('manager').
  controller('ClientEditCtrl', ['$scope', '$uibModalInstance', 'client', 'Provider', 'addressablePatches', ClientEditCtrl]);

  /** @ngInject */
  function ClientEditCtrl($scope, $uibModalInstance, client, Provider, addressablePatches) {
    $scope.client = client;
    //do not accept new providers until ajax is finished.
    $scope.acceptNewProviders = false;
    Provider.query().$promise.then(function(providers){
      var providersLen = providers.length;
      if($scope.client){
        var clientProviders = $scope.client.providers;
        var clientProviderLen = clientProviders.length;
        if(clientProviderLen > 0){
          for(var i = 0; i < providersLen; i++){
            for(var j = 0; j < clientProviderLen; j++){
              if(providers[i].id === clientProviders[j].id){
                providers[i].isProvider = true;
                break;
              }
            }
          }
        }
      }
      $scope.acceptNewProviders = true;
      $scope.providers = providers;
    });
    $scope.title = $scope.client? 'Edit client "'+$scope.client.name+'"': 'New client';
    $scope.providers = [];
    $scope.newProvider = '';
    $scope.failedProvider = false;
    $scope.savingProvider = false;

    $scope.$watch('newProvider', function(){
      $scope.failedProvider = false;
    });

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function(){
      if ($scope.clientForm.$invalid) {
        return;
      }
      var closeMsg = {save: true};
      if($scope.client.id){
        closeMsg.patches = buildPatchOperations($scope);
      }else{
        $scope.client.providers = [];
        var providersLen = $scope.providers.length;
        for(var i = 0; i < providersLen; i++){
          var provider = $scope.providers[i];
          if(provider.isProvider){
            $scope.client.providers.push(provider);
          }
        }
      }
      closeMsg.client = $scope.client;
      $uibModalInstance.close(closeMsg);
    };

    $scope.delete = function(){
      $uibModalInstance.close({delete: true, client: $scope.client});
    };

    $scope.addProvider = function(){
      if($scope.acceptNewProviders && $scope.newProvider.trim() !== ''){
        $scope.savingProvider = true;
        var newProvider = $scope.newProvider.trim();
        $scope.providers.push({name: newProvider});
        Provider.save({name: $scope.newProvider}).$promise.then(function(provider){
          var providersLen = $scope.providers.length;
          for(var i = 0; i < providersLen; i++){
            if($scope.providers[i].name === newProvider){
              $scope.providers[i] = provider;
              break;
            }
          }
          $scope.newProvider = '';
        }).catch(function(){
          var providersLen = $scope.providers.length;
          var index = -1;
          for(var i = 0; i < providersLen; i++){
            if($scope.providers[i].name === newProvider){
              index = i;
              break
            }
          }
          if(index >= 0){
            $scope.providers.splice(index, 1);
          }
        }).finally(function(){
          $scope.savingProvider = false;
        });
      }
    };

    $scope.deleteProvider = function(providerId, index){
      var deletedProvider = $scope.providers.splice(index, 1)[0];
      Provider.delete({id:providerId}).$promise.catch(function(){
        //insert deleted provider if request fails.
        $scope.providers.splice(index, 1, deletedProvider);
      });
    };

    $scope.editProvider = function(providerId, index){
      $scope.providers[index].newName = $scope.providers[index].name;
      $scope.providers[index].editing = true;
    };

    $scope.providerKeyUp = function(event, providerId, index){
      if(event.keyCode !== 13){
        return false;
      }
      $scope.providerInputBlur(providerId, index);
    };

    $scope.providerInputBlur = function(providerId, index){
      var newName = $scope.providers[index].newName;
      var oldValue = $scope.providers[index].name;
      $scope.providers[index].name = newName;
      $scope.providers[index].editing = false;
      Provider.update({id: providerId, name: newName}).$promise.catch(function(){
        $scope.providers[index].name = oldValue;
        $scope.providers[index].editing = true;
      });
    };

    var buildPatchOperations = function($scope){
      var patches = addressablePatches($scope, 'client');
      var providers = $scope.providers;
      var providersLen = providers.length;
      var clientProviders = $scope.client.providers;
      var clientProviderLen = clientProviders.length;
      //find removed providers
      for(var i = 0; i < providersLen; i++){
        var provider = providers[i];
        if(!provider.isProvider){
          var foundIndex = findInArray(provider.id, clientProviders);
          if(foundIndex >= 0){
            $scope.client.providers.splice(foundIndex, 1);
            patches.push({op: 'remove', path: '/providers/' + provider.id});
          }
        }
      }
      //find added providers
      for(var i = 0; i < providersLen; i++){
        var provider = providers[i];
        if(provider.isProvider){
          if(findInArray(provider.id, clientProviders) === -1){
            $scope.client.providers.push(provider);
            patches.push({op: 'add', path: '/providers' , value: provider.id});
          }
        }
      }
      return {patches: patches};
    };

    var findInArray = function(id, arr){
      var arrLen = arr.length;
      for(var i = 0; i < arrLen; i++){
        if(arr[i].id === id){
          return i;
        }
      }
      return -1;
    }
  }
})();
