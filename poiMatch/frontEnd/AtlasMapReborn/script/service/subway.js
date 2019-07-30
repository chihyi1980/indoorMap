'use strict';

angular.module('atlas')
  .factory('Subway', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        fetch: function(cityid) {
          var url = API_PREFIX + '/api_test/malls/group/subway/' + cityid + '?callback=JSON_CALLBACK';
          return $http.jsonp(url).success(function(data) {
            return data;
          });
        },
      };
    }
  ]);