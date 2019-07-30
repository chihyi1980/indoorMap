'use strict';

angular.module('atlas')
  .factory('Eat', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        // fetch: function() {
        //     var url = 'http://ap.atlasyun.com/api/hotkeys?callback=JSON_CALLBACK';
        //     return $http.jsonp(url).success(function(data) {
        //         return data;
        //     });
        // },
        fetch: function(bpid) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com:3002/api/shops/mid/' + bpid + '/sh?prods=0+1+5&callback=JSON_CALLBACK';
          var url = API_PREFIX + ':3002/api/shops/mid/' + bpid + '/sh?prods=0+1+5&callback=JSON_CALLBACK';
          return $http.jsonp(url).then(function(data) {
            return data;
          });

          // $http.get(url, {cache: true}).success(function(data) {
          //     deferred.resolve(data);
          // });
          // return deferred.promise;
        }
      };
    }
  ]);