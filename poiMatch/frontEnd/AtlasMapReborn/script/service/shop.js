'use strict';

angular.module('atlas')
  .factory('Shop', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(spid,cityid) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/shop/pid/' + spid + '/' + DEFAULT_CITY_ID;
          var url = API_PREFIX + '/api_test/shop/pid/' + spid + '/' + cityid;
          console.log(url);
          $http.get(url).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);