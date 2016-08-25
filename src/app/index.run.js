(function() {
  'use strict';

  angular.module('manager').run(['$log', boostrap]);

  /** @ngInject */
  function boostrap($log) {
    $log.debug('boostrap end');
  }
})();
