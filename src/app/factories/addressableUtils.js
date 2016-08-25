(function() {
  'use strict';

  angular.module('manager').factory('addressablePatches', [addressablePatches]);

  function addressablePatches(){
    return function(addressableScope, prop){
      var patches = [
        {op: 'replace', path: '/name', value: addressableScope[prop].name.trim()},
        {op: 'replace', path: '/email', value: addressableScope[prop].email.trim()}
      ];
      debugger;
      if(addressableScope[prop].phone.trim().length === 0){
        patches.push({op: 'remove', path: '/phone'});
      }else{
        patches.push({op: 'replace', path: '/phone', value: addressableScope[prop].phone});
      }
      return patches;
    };
  }
})();
