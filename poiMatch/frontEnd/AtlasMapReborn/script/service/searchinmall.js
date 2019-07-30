'use strict';

angular.module('atlas')
    .factory('Searchinmall', ['$http', 'DEFAULT_CITY_ID', '$location', 'API_PREFIX',
        function($http, DEFAULT_CITY_ID, $location, API_PREFIX) {
            return {
                searchMall: function(mallId, keyword, cityid) {
                    var url = API_PREFIX + '/api_test/shops/mid/' + mallId + '/' + cityid + '?name=' + keyword + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).then(function(data) {
                        console.log(data.data);
                        console.log(url);
                        return data;
                    });
                }
            };
        }
    ]);