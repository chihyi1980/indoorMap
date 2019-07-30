'use strict';

angular.module('atlas')
    .factory('WxCollect', ['$http', 'API_PREFIX', '$q',
        function($http, API_PREFIX, $q) {
            return {
                fetch: function(openid) {
                    if (!!openid) {
                        var url = API_PREFIX + '/api_test/favorite/'+ openid +'?callback=JSON_CALLBACK';
                        return $http.jsonp(url).success(function(data) {
                            return data;
                        });
                    } else {
                        return undefined;
                    }
                    
                }
            };
        }
    ]);