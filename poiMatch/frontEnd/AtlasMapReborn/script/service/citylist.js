'use strict';

angular.module('atlas')
    .factory('CityList', ['$http', 'API_PREFIX', '$q',
        function($http, API_PREFIX, $q) {
            return {
                fetch: function() {
                    // var url = API_PREFIX + '/api_test/city/list?callback=JSON_CALLBACK'
                    // return $http.jsonp(url).success(function(data) {
                    //     return data;
                    // });
                    var deferred = $q.defer();
                    var url = API_PREFIX + '/api_test/city/list?callback=JSON_CALLBACK';
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