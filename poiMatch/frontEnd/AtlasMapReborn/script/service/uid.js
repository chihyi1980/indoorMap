'use strict';

angular.module('atlas')
  .factory('global', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        uid : null
      }
  }
  ]);