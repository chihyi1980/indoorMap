'use strict';

angular.module('atlas')
    .factory('Districts', ['$http', '$q', 'cache', 'API_PREFIX',
        function($http, $q, cache, API_PREFIX) {
            return {
                fetch: function(cityid) {
                    // var url = 'http://ap.atlasyun.com/api/malls/group/districts?callback=JSON_CALLBACK';
                    // var url = API_PREFIX + '/api_test/malls/group/districts?callback=JSON_CALLBACK';
                    // return $http.jsonp(url).success(function(data) {
                    //     return data;
                    // });
                    var deferred = $q.defer();
                    var url = API_PREFIX + '/api_test/malls/group/districts?callback=JSON_CALLBACK';
                    $http.get(url, {
                        cache: true
                    }).success(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
            };
        }
    ]);