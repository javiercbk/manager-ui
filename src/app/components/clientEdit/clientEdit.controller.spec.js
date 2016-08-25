(function() {
  'use strict';

  describe('ClientEditCtrl', function(){
    var $controller, $httpBackend, $scope, $rootScope, createController;

    var fakeModalInstance = {
      close: function(closeMsg){

      }
    };

    beforeEach(module('manager'));
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      var providerResource = $injector.get('Provider');
      var addressablePatches = $injector.get('addressablePatches');
      createController = function($scope, client) {
       return $controller('ClientEditCtrl', {$scope: $scope,
         Provider: providerResource,
         $uibModalInstance: fakeModalInstance,
         addressablePatches: addressablePatches,
         client: client});
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('it should not accept new providers until providers is resolved', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      expect($scope.acceptNewProviders).toBeFalsy();
      $httpBackend.flush();
      expect($scope.acceptNewProviders).toBeTruthy();
      expect($scope.providers.$resolved).toBeTruthy();
    });

    it('it should build add the missing providers when client is new', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'provider 1', isProvider: true},
        {id: 2, name: 'provider 2', isProvider: false},
        {id: 3, name: 'provider 3', isProvider: false}];
      $scope.client = {name: 'Brian', email: 'brian@gmail.com', phone: '', providers: []};
      spyOn(fakeModalInstance, 'close').and.returnValue('ok');
      $scope.clientForm = {$invalid: false};
      $scope.save();
      expect(fakeModalInstance.close).toHaveBeenCalledWith({
        save: true,
        client: {name: 'Brian',
          email: 'brian@gmail.com',
          phone: '',
          providers: [{id: 1, name: 'provider 1', isProvider: true}]}
      });
    });

    it('it should build a patch all properties if necessary', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'provider 1', isProvider: false},
        {id: 2, name: 'provider 2', isProvider: false},
        {id: 3, name: 'provider 3', isProvider: false}];
      $scope.client = {id: 1, name: 'Brian', email: 'brian@gmail.com', phone: '444-4444', providers: []};
      spyOn(fakeModalInstance, 'close').and.returnValue('ok');
      $scope.clientForm = {$invalid: false};
      $scope.save();
      expect(fakeModalInstance.close).toHaveBeenCalledWith({
        save: true,
        client: {
          id: 1,
          name: 'Brian',
          email: 'brian@gmail.com',
          phone: '444-4444',
          providers: []
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian'},
          {op:'replace', path: '/email', value: 'brian@gmail.com'},
          {op:'replace', path: '/phone', value: '444-4444'}]}
        }
      );
    });

    it('it should build a patch remove on /phone path when phone is empty string', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'provider 1', isProvider: false},
        {id: 2, name: 'provider 2', isProvider: false},
        {id: 3, name: 'provider 3', isProvider: false}];
      $scope.client = {id: 1, name: 'Brian', email: 'brian@gmail.com', phone: '', providers: []};
      spyOn(fakeModalInstance, 'close').and.returnValue('ok');
      $scope.clientForm = {$invalid: false};
      $scope.save();
      expect(fakeModalInstance.close).toHaveBeenCalledWith({
        save: true,
        client: {
          id: 1,
          name: 'Brian',
          email: 'brian@gmail.com',
          phone: '',
          providers: []
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian'},
          {op:'replace', path: '/email', value: 'brian@gmail.com'},
          {op:'remove', path: '/phone'}]}
        }
      );
    });

    it('it should add a /provider when is missing', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'provider 1', isProvider: true},
        {id: 2, name: 'provider 2', isProvider: false},
        {id: 3, name: 'provider 3', isProvider: false}];
      $scope.client = {id: 1, name: 'Brian', email: 'brian@gmail.com', phone: '', providers: []};
      spyOn(fakeModalInstance, 'close').and.returnValue('ok');
      $scope.clientForm = {$invalid: false};
      $scope.save();
      expect(fakeModalInstance.close).toHaveBeenCalledWith({
        save: true,
        client: {
          id: 1,
          name: 'Brian',
          email: 'brian@gmail.com',
          phone: '',
          providers: [{id: 1, name: 'provider 1', isProvider: true}]
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian'},
          {op:'replace', path: '/email', value: 'brian@gmail.com'},
          {op:'remove', path: '/phone'},
          {op:'add', path: '/providers', value: 1}]
        }
      });
    });

    it('it should remove a /provider when is missing', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'provider 1', isProvider: false},
        {id: 2, name: 'provider 2', isProvider: false},
        {id: 3, name: 'provider 3', isProvider: false}];
      $scope.client = {id: 1, name: 'Brian', email: 'brian@gmail.com', phone: '', providers: [{id: 1, name: 'provider 1'}]};
      spyOn(fakeModalInstance, 'close').and.returnValue('ok');
      $scope.clientForm = {$invalid: false};
      $scope.save();
      expect(fakeModalInstance.close).toHaveBeenCalledWith({
        save: true,
        client: {
          id: 1,
          name: 'Brian',
          email: 'brian@gmail.com',
          phone: '',
          providers: []
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian'},
          {op:'replace', path: '/email', value: 'brian@gmail.com'},
          {op:'remove', path: '/phone'},
          {op:'remove', path: '/providers/1'}]
        }
      });
    });

    it('providers should not be changed if no necessary', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'provider 1', isProvider: true},
        {id: 2, name: 'provider 2', isProvider: false},
        {id: 3, name: 'provider 3', isProvider: false}];
      $scope.client = {id: 1, name: 'Brian', email: 'brian@gmail.com', phone: '', providers: [{id: 1, name: 'provider 1'}]};
      spyOn(fakeModalInstance, 'close').and.returnValue('ok');
      $scope.clientForm = {$invalid: false};
      $scope.save();
      expect(fakeModalInstance.close).toHaveBeenCalledWith({
        save: true,
        client: {
          id: 1,
          name: 'Brian',
          email: 'brian@gmail.com',
          phone: '',
          providers: [{id: 1, name: 'provider 1'}]
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian'},
          {op:'replace', path: '/email', value: 'brian@gmail.com'},
          {op:'remove', path: '/phone'}
          ]
        }
      });
    });

    it('provider should be added', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [];
      $scope.newProvider = 'New Provider';
      $httpBackend.whenPOST('/api/providers').respond({id:1, name: 'New Provider'});
      $httpBackend.expectPOST('/api/providers');
      $scope.addProvider();
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].name).toEqual('New Provider');
      expect($scope.providers[0].id).toBeUndefined();
      $httpBackend.flush();
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].id).toEqual(1);
      expect($scope.providers[0].name).toEqual('New Provider');
    });

    it('provider should be removed if ajax fails', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [];
      $scope.newProvider = 'New Provider';
      $httpBackend.whenPOST('/api/providers').respond(500);
      $httpBackend.expectPOST('/api/providers');
      $scope.addProvider();
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].name).toEqual('New Provider');
      expect($scope.providers[0].id).toBeUndefined();
      $httpBackend.flush();
      expect($scope.providers.length).toEqual(0);
    });

    it('provider should be removed if ajax fails', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [];
      $scope.newProvider = 'New Provider';
      $httpBackend.whenPOST('/api/providers').respond(500);
      $httpBackend.expectPOST('/api/providers');
      $scope.addProvider();
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].name).toEqual('New Provider');
      expect($scope.providers[0].id).toBeUndefined();
      $httpBackend.flush();
      expect($scope.providers.length).toEqual(0);
    });

    it('provider should be deleted', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'old provider'}];
      $httpBackend.whenDELETE('/api/providers/1').respond(200, {id: 1, name: 'old provider'});
      $httpBackend.expectDELETE('/api/providers/1');
      $scope.deleteProvider(1, 0);
      $httpBackend.flush();
      expect($scope.providers.length).toEqual(0);
    });

    it('provider should be re inserted if delete fails', function() {
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'old provider'}];
      $httpBackend.whenDELETE('/api/providers/1').respond(500);
      $httpBackend.expectDELETE('/api/providers/1');
      $scope.deleteProvider(1, 0);
      $httpBackend.flush();
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].name).toEqual('old provider');
      expect($scope.providers[0].id).toEqual(1);
    });

    it('provider should be resetted if put fails', function(){
      $httpBackend.whenGET('/api/providers').respond([]);
      $httpBackend.expectGET('/api/providers');
      var cec = createController($scope);
      $httpBackend.flush();
      $scope.providers = [{id: 1, name: 'old provider', newName:'new name'}];
      $httpBackend.whenPUT('/api/providers/1').respond(500);
      $httpBackend.expectPUT('/api/providers/1');
      $scope.providerInputBlur(1, 0);
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].name).toEqual('new name');
      expect($scope.providers[0].id).toEqual(1);
      $httpBackend.flush();
      expect($scope.providers.length).toEqual(1);
      expect($scope.providers[0].name).toEqual('old provider');
      expect($scope.providers[0].id).toEqual(1);
    });

  });
})();
