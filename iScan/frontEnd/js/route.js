angular.module('iScan')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'html/home.html',
                    controller: 'homeCtrl',
                    title: 'Welcome!'
                })
                .when('/login', {
                    templateUrl: 'html/login.html',
                    controller: 'loginCtrl',
                    title:'管理員登錄'
                })
                .when('/jobsite', {
                    templateUrl: 'html/jobsite.html',
                    controller: 'jobsiteCtrl',
                    title:'場地管理'
                })
                .when('/device/:pageNo', {
                    templateUrl: 'html/device.html',
                    controller: 'deviceCtrl',
                    title:'用戶設備',
                    resolve: {
                        devicesAll: ['HttpRequestApi','$route','$location',
                            function(HttpRequestApi, $route, $location){
                                var pageNo = $route.current.params.pageNo;
                                if(pageNo < 1){
                                    $location.path('/device/1')
                                }
                                var queryStr = $location.$$url.split('?')[1] || null;
                                return HttpRequestApi.getAllDevices(pageNo, queryStr);
                            }
                        ]
                    }
                })
                .when('/beacon/:pageNo', {
                    templateUrl: 'html/beacon.html',
                    controller: 'beaconCtrl',
                    title:'定位装置',
                    resolve: {
                        beaconsAll: ['HttpRequestApi','$route','$location',
                            function(HttpRequestApi, $route, $location){
                                var pageNo = $route.current.params.pageNo;
                                if(pageNo < 1){
                                    $location.path('/device/1')
                                }
                                var queryStr = $location.$$url.split('?')[1] || null;
                                return HttpRequestApi.getAllBeacons(pageNo, queryStr);
                            }
                        ]
                    }
                })
                .when('/tagger/:pageNo', {
                    templateUrl: 'html/tagger.html',
                    controller: 'taggerCtrl',
                    title:'定位資訊',
                    resolve: {
                        taggersAll: ['HttpRequestApi','$route',
                            function(HttpRequestApi, $route){
                                var pageNo = $route.current.params.pageNo;
                                return HttpRequestApi.getAllTaggers(pageNo);
                            }
                        ]
                    }
                })
                .when('/user', {
                    templateUrl: 'html/user.html',
                    controller: 'userCtrl',
                    title:'系統用戶',
                    resolve: {
                        usersAll: ['HttpRequestApi','$route',
                            function(HttpRequestApi, $route){
                                return HttpRequestApi.getAllUsers();
                            }
                        ]
                    }
                })
                .when('/overview', {
                    templateUrl: 'html/overview.html',
                    controller: 'overviewCtrl',
                    title:'數據報表'
                })

                .when('/analysis', {
                    templateUrl: 'html/analysis.html',
                    controller: 'analysisCtrl',
                    title:'統計分析'
                })
                .when('/overview', {
                    templateUrl: 'html/overview.html',
                    controller: 'overviewCtrl',
                    title:'數據報表'
                })
                .when('/events', {
                    templateUrl: 'html/events.html',
                    controller: 'eventsCtrl',
                    title:'通報管理'
                })

                .when('/indoorMap', {
                    templateUrl: 'html/indoorMap.html',
                    controller: 'indoorCtrl',
                    title:'室內地圖'
                })
                .when('/monitor', {
                    templateUrl: 'html/monitor.html',
                    controller: 'monitorCtrl',
                    title:'攝像監控'
                })
                .otherwise({
                    redirectTo: '/login'
                });
        }
    ]);