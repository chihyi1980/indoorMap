'use strict';

angular.module('atlas')
  .factory('Hotkey', ['$http', '$q', 'cache', 'API_PREFIX',
    function($http, $q, cache, API_PREFIX) {
      return {
        fetch: function() {
          // var url = 'http://ap.atlasyun.com/api/hotkeys?callback=JSON_CALLBACK';
          // var url = API_PREFIX + '/api_test/hotkeys?callback=JSON_CALLBACK';
          // return $http.jsonp(url).success(function(data) {
          //   return data;
          // });
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/hotkeys/search?key=' + keyword + '&callback=JSON_CALLBACK';
          var url = API_PREFIX + '/api_test/hotkeys?callback=JSON_CALLBACK';
          return $http.jsonp(url).then(function(data) {
            return data;
          });
        },
        searchHotkey: function(keyword) {
          var deferred = $q.defer();
          // var url = 'http://ap.atlasyun.com/api/hotkeys/search?key=' + keyword + '&callback=JSON_CALLBACK';
          var url = API_PREFIX + '/api_test/hotkeys/search?key=' + keyword + '&callback=JSON_CALLBACK';
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