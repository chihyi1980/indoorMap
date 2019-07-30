'use strict';

angular.module('atlas')
  .factory('Prods', ['$http', 'DEFAULT_CITY_ID', '$q', 'cache', 'API_PREFIX',
    function($http, DEFAULT_CITY_ID, $q, cache, API_PREFIX) {
      return {
        fetch: function(bpid, keyword, cityid) {
          var deferred = $q.defer();
          var url = API_PREFIX + '/api_test/shops/mid/' + bpid + '/' + cityid + '?prods=' + keyword + '&callback=JSON_CALLBACK';
          $http.jsonp(url).success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      };
    }
  ]);