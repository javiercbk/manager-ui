(function() {
  'use strict';
  angular.module('manager').config(['$logProvider', config]);
  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }
})();
