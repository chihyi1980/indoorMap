'use strict';
angular.module('atlas')
    .constant('DEFAULT_CITY_ID', 1)
    .constant('IMAGE_PREFIX', 'http://atlasyun.qiniudn.com/')
    // .constant('API_PREFIX', (navigator.userAgent.indexOf("MSIE") > -1 ? window.location.pathname.split( '/' )[0] : window.location.origin))
    .constant('API_PREFIX', 'http://ap.atlasyun.com')
    .run(['$rootScope', 'cfpLoadingBar', '$location', 'geolocation', 'Localstorage', '$route', 'global',
        function($rootScope, cfpLoadingBar, $location, geolocation, Localstorage, $route, global) {
            $rootScope.$on('$routeChangeStart', function() {
                cfpLoadingBar.start();
            });
            $rootScope.$on('$routeChangeError', function() {
                $location.path('/');
                cfpLoadingBar.complete();
            });

            $rootScope.$on('$viewContentLoaded', function() {
                cfpLoadingBar.complete();
            });
            $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute) {
                $rootScope.title = $route.current.title;
            });

            //get gps location
            geolocation.getLocation()
                .then(function(data) {
                    if (data) {
                        Localstorage.setGPS(data.coords.latitude, data.coords.longitude);
                    }
                })
                .finally(function(data) {
                    if (data) {
                        Localstorage.setGPS(data.coords.latitude, data.coords.longitude);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    ]);
