'use strict';

angular.module('atlas')
    .factory('Search', ['$http', '$q', 'DEFAULT_CITY_ID', 'API_PREFIX',
        function($http, $q, DEFAULT_CITY_ID, API_PREFIX) {
            return {
                searchAll: function(keyword, page, cityid) {
                    // var url = 'http://ap.atlasyun.com:3002/api/search/sh?keywords=' + keyword + '&callback=JSON_CALLBACK';
                    var url = API_PREFIX + '/api_test/search/' + cityid + '?keywords=' + keyword + '&p=' + page + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                },
                searchNext: function(keyword, page, cityid) {
                    page++;
                    console.log(page);
                    var url = API_PREFIX + '/api_test/search/' + cityid + '?keywords=' + keyword + '&p=' + page + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).success(function(data) {
                        return data;
                    });
                }
            };
        }
    ]);