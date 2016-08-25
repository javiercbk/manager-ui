(function() {
  'use strict';

  angular.module('manager').
  factory('Client', ['$resource', ClientResource]).
  factory('Employee', ['$resource', EmployeeResource]).
  factory('Office', ['$resource', OfficeResource]).
  factory('Provider', ['$resource', ProviderResource]);

  var transformRequest = function(data, headers) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
    return JSON.stringify(data);
  };

  var updateCmd = {
    method: 'PATCH',
    transformRequest: transformRequest
  };

  function ClientResource($resource){
    return $resource('/api/clients/:id', {id: '@id'}, {update: updateCmd});
  }

  function EmployeeResource($resource){
    return $resource('/api/employees/:id', {id: '@id'}, {update: updateCmd});
  }

  function OfficeResource($resource){
    return $resource('/api/offices/:id', {id: '@id'}, {update: updateCmd});
  }

  function ProviderResource($resource){
    return $resource('/api/providers/:id', {id: '@id'}, {update: {method: 'PUT', transformRequest: transformRequest}});
  }
})();
