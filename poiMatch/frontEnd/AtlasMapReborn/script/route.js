'use strict';

angular.module('atlas')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/home/:cityid', {
          templateUrl: 'partials/home.html',
          controller: 'homeCtrl',
          title: '商场通',
          resolve: {
            malls: ['Malls', '$route',
              function(Malls, $route) {
                var cityid = $route.current.params.cityid;
                return Malls.fetch(cityid);
              }
            ],
            wxCollect :['WxCollect', '$route',
              function(WxCollect, $route){
                var uid = $route.current.params.uid;
                return WxCollect.fetch(uid);
              }
            ]
          }
        })
        .when('/building/:cityid/:bid', {
          templateUrl: 'partials/building.html',
          controller: 'buildingCtrl',
          resolve: {
            building: ['Building', '$route',
              function(Building, $route) {
                var cityid = $route.current.params.cityid;
                var bid = $route.current.params.bid;
                return Building.fetch(bid,cityid);
              }
            ]
          }
        })
        .when('/shop/:cityid/:sid', {
          templateUrl: 'partials/shop.html',
          controller: 'shopCtrl',
          resolve: {
            shop: ['Shop', '$route',
              function(Shop, $route) {
                var cityid = $route.current.params.cityid;
                var sid = $route.current.params.sid;
                return Shop.fetch(sid,cityid);
              }
            ]
          }
        })
        .when('/search/:cityid/:keyword/:p?', {
          templateUrl: 'partials/search.html',
          controller: 'searchCtrl',
          resolve: {
            searchAll: ['Search', '$route',
              function(Search, $route) {
                var keyword = encodeURIComponent($route.current.params.keyword);
                var page = $route.current.params.p;
                var cityid = $route.current.params.cityid;
                return Search.searchAll(keyword, page, cityid);
              }
            ],
            searchNext: ['Search', '$route',
              function(Search, $route) {
                var keyword = encodeURIComponent($route.current.params.keyword);
                var page = $route.current.params.p;
                var cityid = $route.current.params.cityid;
                return Search.searchNext(keyword, page, cityid);
              }
            ]
          }
        })
        .when('/hotkey/:keyword', {
          templateUrl: 'partials/hotkey.html',
          controller: 'hotkeyCtrl',
          resolve: {
            searchHotkey: ['Hotkey', '$route',
              function(Hotkey, $route) {
                var keyword = $route.current.params.keyword;
                return Hotkey.searchHotkey(keyword);
              }
            ]
          }
        })
        .when('/brand/:cityid/:keyword', {
          templateUrl: 'partials/brand.html',
          controller: 'brandCtrl',
          resolve: {
            searchBrand: ['Brand', '$route',
              function(Brand, $route) {
                var keyword = $route.current.params.keyword;
                var cityid = $route.current.params.cityid;
                return Brand.searchBrand(keyword, cityid);
              }
            ]
          }
        })
        .when('/searchinmall/:cityid/:mallId/:keyword', {
          templateUrl: 'partials/searchinmall.html',
          controller: 'searchInMallCtrl',
          resolve: {
            searchMall: ['Searchinmall', '$route',
              function(Searchinmall, $route) {
                var keyword = $route.current.params.keyword;
                var mallId = $route.current.params.mallId;
                var cityid = $route.current.params.cityid;
                return Searchinmall.searchMall(mallId, keyword, cityid);
              }
            ]
          }
        })
        .when('/map/:parentId?/:floorId?/:shopId?', {
          templateUrl: 'partials/newMap.html',
          controller: 'newMapCtrl',
          resolve: {
            mapBuilding: ['MapOfBuilding', '$route',
              function(MapOfBuilding, $route) {
                var buildingId = $route.current.params.parentId.split('&')[1];
                return MapOfBuilding.mapBuilding(buildingId);
              }
            ],
            shopsOfMall: ['MapOfBuilding', '$route', function(MapOfBuilding, $route) {
              var mallId = $route.current.params.parentId.split('&')[0];
              return MapOfBuilding.shopsOfMall(mallId);
            }]
          }
        })
        .when('/malltag/:cityid/:buildingid/:keyword', {
          templateUrl: 'partials/malltag.html',
          controller: 'mallTagCtrl',
          resolve: {
            mallProd: ['Prods', '$route',
              function(Prods, $route) {
                var cityid = $route.current.params.cityid;
                var buildingid = $route.current.params.buildingid;
                var keyword = $route.current.params.keyword;
                return Prods.fetch(buildingid, keyword, cityid);
              }
            ]
          }
        })
        .when('/coupon', {
          templateUrl: 'partials/coupon.html',
          controller: 'couponCtrl'
        })
        .when('/mycollect', {
          templateUrl: 'partials/mycollect.html',
          controller: 'mycollectCtrl'
        })
        .when('/go', {
          templateUrl: 'partials/go.html',
          controller: 'goCtrl'
        })
        .when('/category/:bid/:cityid', {
          templateUrl: 'partials/category.html',
          controller: 'categoryCtr',
          resolve: {
            building: ['Building', '$route',
              function(Building, $route) {
                var cityid = $route.current.params.cityid;
                var bid = $route.current.params.bid;
                return Building.fetch(bid,cityid);
              }
            ]
          }
        })
        .when('/outdoormap', {
          templateUrl: 'partials/outdoormap.html',
          controller: 'outdoormapCtrl'
        })
        .when('/submit', {
          templateUrl: 'partials/submit.html',
          controller: 'submitCtrl'
        })
        .otherwise({
          redirectTo: '/home/53d5e4c85620fa7f111a3f67'
        });
    }
  ]);