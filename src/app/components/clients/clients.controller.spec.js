(function() {
  'use strict';

  describe('ClientsCtrl', function(){
    var $controller, $httpBackend, $rootScope, $scope, $q, modalPromise, createController;

    beforeEach(module('manager'));
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      $scope = $rootScope.$new();

      var ClientProvider = $injector.get('Client');

      var fakeModal = {open: function(){
        return fakeModalInstance;
      }};

      modalPromise = $q.defer();

      var fakeModalInstance = {result: modalPromise.promise}

      createController = function(scope) {
       return $controller('ClientsCtrl', {$scope : scope,
         Client: ClientProvider, $uibModal: fakeModal});
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('it should update clients on save', function() {
      $httpBackend.whenGET('/api/clients').respond([{id: 1,
        name: 'Zuper Klient',
        email: 'zuper@klient.com',
        phone: '444-4444'}]);
      $httpBackend.expectGET('/api/clients');
      createController($scope);
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Zuper Klient');
      expect($scope.clients[0].email).toEqual('zuper@klient.com');
      expect($scope.clients[0].phone).toEqual('444-4444');
      $httpBackend.when('PATCH', '/api/clients/1').respond(201);
      $httpBackend.expect('PATCH', '/api/clients/1');
      $scope.openClientModal(1, 0);
      modalPromise.resolve({save: true,
        client: {
          id:1,
          name: 'Brian Griffin',
          email: 'brian@griffin.com',
          phone: '111-1111'
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian Griffin'},
          {op:'replace', path: '/email', value: 'brian@griffin.com'},
          {op:'replace', path: '/phone', value: '111-1111'}]}
      });
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Brian Griffin');
      expect($scope.clients[0].email).toEqual('brian@griffin.com');
      expect($scope.clients[0].phone).toEqual('111-1111');
    });

    it('If patch fails it should reset the original client', function() {
      $httpBackend.whenGET('/api/clients').respond([{id: 1,
        name: 'Zuper Klient',
        email: 'zuper@klient.com',
        phone: '444-4444'}]);
      $httpBackend.expectGET('/api/clients');
      createController($scope);
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Zuper Klient');
      expect($scope.clients[0].email).toEqual('zuper@klient.com');
      expect($scope.clients[0].phone).toEqual('444-4444');
      $httpBackend.when('PATCH', '/api/clients/1').respond(500);
      $httpBackend.expect('PATCH', '/api/clients/1');
      $scope.openClientModal(1, 0);
      modalPromise.resolve({save: true,
        client: {
          id:1,
          name: 'Brian Griffin',
          email: 'brian@griffin.com',
          phone: '111-1111'
        },
        patches: {patches: [{op:'replace', path: '/name', value: 'Brian Griffin'},
          {op:'replace', path: '/email', value: 'brian@griffin.com'},
          {op:'replace', path: '/phone', value: '111-1111'}]}
      });
      $scope.$digest();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Brian Griffin');
      expect($scope.clients[0].email).toEqual('brian@griffin.com');
      expect($scope.clients[0].phone).toEqual('111-1111');
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Zuper Klient');
      expect($scope.clients[0].email).toEqual('zuper@klient.com');
      expect($scope.clients[0].phone).toEqual('444-4444');
    });

    it('it should post a new client', function() {
      $httpBackend.whenGET('/api/clients').respond(200, []);
      $httpBackend.expectGET('/api/clients');
      createController($scope);
      $httpBackend.flush();

      $httpBackend.whenPOST('/api/clients').respond(200, {
        id: 1,
        name: 'Brian Griffin',
        email: 'brian@griffin.com',
        phone: '111-1111'
      });
      $httpBackend.expectPOST('/api/clients');
      $scope.openClientModal(1, 0);
      modalPromise.resolve({save: true,
        client: {
          name: 'Brian Griffin',
          email: 'brian@griffin.com',
          phone: '111-1111',
          providers: []
        }
      });
      $scope.$digest();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toBeUndefined();
      expect($scope.clients[0].name).toEqual('Brian Griffin');
      expect($scope.clients[0].email).toEqual('brian@griffin.com');
      expect($scope.clients[0].phone).toEqual('111-1111');
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Brian Griffin');
      expect($scope.clients[0].email).toEqual('brian@griffin.com');
      expect($scope.clients[0].phone).toEqual('111-1111');
    });

    it('If client post fails it delete the newly added client', function() {
      $httpBackend.whenGET('/api/clients').respond(200, []);
      $httpBackend.expectGET('/api/clients');
      createController($scope);
      $httpBackend.flush();

      $httpBackend.whenPOST('/api/clients').respond(500);
      $httpBackend.expectPOST('/api/clients');
      $scope.openClientModal(1, 0);
      modalPromise.resolve({save: true,
        client: {
          name: 'Brian Griffin',
          email: 'brian@griffin.com',
          phone: '111-1111',
          providers: []
        }
      });
      $scope.$digest();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toBeUndefined();
      expect($scope.clients[0].name).toEqual('Brian Griffin');
      expect($scope.clients[0].email).toEqual('brian@griffin.com');
      expect($scope.clients[0].phone).toEqual('111-1111');
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(0);
    });


    it('If client delete fails the deleted client should be restored', function() {
      $httpBackend.whenGET('/api/clients').respond(200, [{
        id: 1,
        name: 'Brian Griffin',
        email: 'brian@griffin.com',
        phone: '111-1111'
      }]);
      $httpBackend.expectGET('/api/clients');
      createController($scope);
      $httpBackend.flush();
      $httpBackend.whenDELETE('/api/clients/1').respond(500);
      $httpBackend.expectDELETE('/api/clients/1');
      $scope.openClientModal(1, 0);
      modalPromise.resolve({delete: true,
        client: {
          id: 1,
          name: 'Brian Griffin',
          email: 'brian@griffin.com',
          phone: '111-1111',
          providers: []
        }
      });
      $scope.$digest();
      expect($scope.clients.length).toEqual(0);
      $httpBackend.flush();
      expect($scope.clients.length).toEqual(1);
      expect($scope.clients[0].id).toEqual(1);
      expect($scope.clients[0].name).toEqual('Brian Griffin');
      expect($scope.clients[0].email).toEqual('brian@griffin.com');
      expect($scope.clients[0].phone).toEqual('111-1111');
    });

  });
})();
