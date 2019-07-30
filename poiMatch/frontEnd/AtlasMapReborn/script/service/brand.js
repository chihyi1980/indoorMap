'use strict';

angular.module('atlas')
    .factory('Brand', ['$http', 'API_PREFIX', '$q',
        function($http, API_PREFIX, $q) {
            return {
                fetch: function() {
                    var url = API_PREFIX + '/api_test/brands?callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                },
                searchBrand: function(keyword, cityid) {
                    var url = API_PREFIX + '/api_test/brands/search/' + cityid + '?bid=' + keyword + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                }
            };
        }
    ]);