angular.module('Atlas', [
    'ngRoute'
]);
angular.module('Atlas')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/',
                    (function(){
                        if(config.mallCities){
                            return {
                                redirectTo: '/mall/' + config.mallCities['上海']
                            }
                        }else{
                            return {
                                 templateUrl: 'html/poiMatch.html',
                                 controller: 'MapCtrl',
                                 title:'地图匹配',
                                 resolve: {
                                     malls: ['HttpRequestApi',
                                     function(HttpRequestApi){
                                         return HttpRequestApi.getMalls();
                                         }
                                     ]
                                 }
                            }
                        }
                    })()
                   )
                .when('/mall/:cityId', (function(){
                    if(config.mallCities){
                        return {
                            templateUrl: 'html/poiMatch.html',
                            controller: 'MapCtrl',
                            title:'地图匹配',
                            resolve: {
                                malls: ['$route','HttpRequestApi',
                                    function($route, HttpRequestApi){
                                        var cityId = $route.current.params.cityId;
                                        return HttpRequestApi.getMalls(cityId);
                                    }
                                ]
                            }
                        }
                    }else{
                        return {
                            redirectTo: '/'
                        }
                    }
                })())
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);
