'use strict';

angular.module('atlas')
  .factory('Malls', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', '$location', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, $location, API_PREFIX) {
      return {
        fetch: function(cityid) {
          console.log($location)
          console.log(window.location)

          var deferred = $q.defer();
          var url = API_PREFIX + '/api_test/malls/' + cityid;
          // var url = 'http://ap.atlasyun.com/api/malls/' + DEFAULT_CITY_ID;
          console.log(url)
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