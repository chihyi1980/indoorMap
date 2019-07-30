'use strict';

angular.module('atlas')
    .factory('MapOfBuilding', ['$http', '$q', 'API_PREFIX',
        function($http, $q, API_PREFIX) {
            return {
                mapBuilding: function(buildingId) {
                    // var url = 'http://ap.atlasyun.com:3001/map/building/getSimple?id=' + buildingId + '&callback=JSON_CALLBACK';
                    var url = API_PREFIX.replace(/\/$/, '') + ':3001/map/building/getSimple?id=' + buildingId + '&callback=JSON_CALLBACK';
                    return $http.jsonp(url).then(function(ret) {
                        if (ret.data.result == 'succeed') {
                            return ret.data.data;
                        }
                    });
                },
                shopsOfMall: function(mallId) {
                    var cache;
                    try {
                        cache = JSON.parse(localStorage.getItem('shopsOfMall' + mallId));
                    } catch (e) {
                        cache = null
                    }
                    if (cache) {
                        return cache;
                    }
                    // var url = 'http://ap.atlasyun.com:3002/api/shops/mid/' + mallId +'/sh?callback=JSON_CALLBACK';
                    var url = API_PREFIX.replace(/\/$/, '') + ':3002/api/shops/mid/' + mallId + '/sh?callback=JSON_CALLBACK';
                    return $http.jsonp(url).then(function(ret) {
                        localStorage.setItem('shopsOfMall' + mallId, JSON.stringify(ret.data));
                        return ret.data;
                    });
                }
            };
        }
    ]);