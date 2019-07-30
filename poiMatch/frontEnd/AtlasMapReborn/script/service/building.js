'use strict';

angular.module('atlas')
  .factory('Building', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(bpid,cityid) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/mall/pid/' + bpid + '/' + DEFAULT_CITY_ID;
          var url = API_PREFIX + '/api_test/mall/pid/' + bpid + '/' + cityid;
          $http.get(url, {
            cache: true
          }).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);