'use strict';

angular
  .module('atlas')
  .controller('shopCtrl', ['$scope', 'global', 'API_PREFIX', 'WxCollect', 'shop', 'Shop', 'Localstorage', '$timeout', '$http', '$route', '$location', '$window',
    function($scope, global, API_PREFIX, WxCollect, shop, Shop, Localstorage, $timeout, $http, $route, $location, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
      if (localStorage.getItem('sctReferrer')) {
        var refer = localStorage.getItem('sctReferrer').split('_');
        $scope.htmlTitle = refer[0] == 'gmega' ? 'GMEGA商场地图' : '商场通';
      }

      $scope.shop = shop;
      $scope.cityId = $route.current.params.cityid;
      console.log(shop);

      var storeShop = {};
      storeShop.id = $scope.shop.poi_id;
      storeShop.ch_name = $scope.shop.ch_name;
      storeShop.cityid = $route.current.params.cityid;
      storeShop.buildingname = $scope.shop.building.ch_name;
      storeShop.floorname = $scope.shop.floor.ch_name;
      storeShop.mallid = $scope.shop.mall.poi_id;
      storeShop.buildingid = $scope.shop.building.poi_id;
      storeShop.floorid = $scope.shop.floor.poi_id;
      if ($scope.shop.logo) {
        var storeShop = {};
        storeShop.id = $scope.shop.poi_id;
        storeShop.ch_name = $scope.shop.ch_name;
        storeShop.cityid = $route.current.params.cityid;
        storeShop.buildingname = $scope.shop.building.ch_name;
        storeShop.floorname = $scope.shop.floor.ch_name;
        storeShop.mallid = $scope.shop.mall.poi_id;
        storeShop.buildingid = $scope.shop.building.poi_id;
        storeShop.floorid = $scope.shop.floor.poi_id;
        storeShop.img = $scope.shop.logo.key;
      } else {
        var storeShop = {};
        storeShop.id = $scope.shop.poi_id;
        storeShop.ch_name = $scope.shop.ch_name;
        storeShop.cityid = $route.current.params.cityid;
        storeShop.buildingname = $scope.shop.building.ch_name;
        storeShop.floorname = $scope.shop.floor.ch_name;
        storeShop.mallid = $scope.shop.mall.poi_id;
        storeShop.buildingid = $scope.shop.building.poi_id;
        storeShop.floorid = $scope.shop.floor.poi_id;
        storeShop.img = '';
      }

      console.log($scope.isLike)
      $scope.showNotice = false;

      function showNotice(content) {
        $scope.noticeContent = content;
        $scope.showNotice = true;
        $timeout(function() {
          $scope.showNotice = false;
        }, 1000);
      }

      if (global.uid) {
        $http({
          method: 'GET',
          url: API_PREFIX + '/api_test/favorite/' + global.uid
        }).success(function(data) {
          $scope.wxcollect = data;
          console.log($scope.wxcollect.shops)

          function findwxshop(storeshop) {
            var isLike = false;
            for (var i in storeshop) {
              if ($scope.shop.poi_id === storeshop[i].poi_id) {
                isLike = true;
              }
            }
            return isLike;
          }
          $scope.isLike = Localstorage.isLikeShop(storeShop) || findwxshop($scope.wxcollect.shops);
        });
      } else {
        $scope.isLike = Localstorage.isLikeShop(storeShop);
      }


      $scope.toogleLike = function(shop) {
        if (global.uid) {
          $scope.isLike = !$scope.isLike;
          if ($scope.isLike === true) {
            var data = {
              poi_id: $route.current.params.sid,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/shops/' + global.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/shops/' + global.uid + '/' + $route.current.params.sid,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
          console.log($scope.isLike);
        } else {
          $scope.isLike = !$scope.isLike;
          var storeShop = {};
          storeShop.id = shop.poi_id;
          storeShop.ch_name = shop.ch_name;
          storeShop.img = $scope.shop.logo.key;
          storeShop.cityid = $route.current.params.cityid;
          storeShop.buildingname = shop.building.ch_name;
          storeShop.floorname = shop.floor.ch_name;
          storeShop.mallid = shop.mall.poi_id;
          storeShop.buildingid = shop.building.poi_id;
          storeShop.floorid = shop.floor.poi_id;
          Localstorage.toogleLikeShop(storeShop);
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
        }
      };
      console.log(encodeURIComponent("http://dpurl.cn/p/ie-qVhFlVm"));
      console.log(decodeURIComponent(encodeURIComponent("http://dpurl.cn/p/ie-qVhFlVm")));
      $scope.showcoupon = false;

      $scope.encodeURIComponent = function(val) {
        return encodeURIComponent(val);
      };
      var nullnick = function(nickname) {
        if (nickname) {
          return nickname;
        } else {
          return '匿名用户';
        }
      }
      $scope.postcomment = function(spid) {
        if ($scope.userComment) {
          $http({
              method: 'POST',
              url: API_PREFIX + '/api/comment/' + $scope.cityId,
              data: $.param({
                poi_id: spid,
                user_nickname: nullnick($scope.userNickname),
                text_excerpt: $scope.userComment,
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .success(function(data) {
              Shop.fetch($route.current.params.sid).then(function(data) {
                $scope.shop.comments = data.comments;
              });
              $scope.userComment = '';
              $scope.userNickname = '';
            });
        } else {}
      };
      $scope.showMarquee = false;
      var shopNavWidth = document.getElementById("shop_nav").offsetWidth * 0.8;
      var shopHWidth = document.getElementById("shop_h1").offsetWidth;

      $scope.showconsole = function() {
        console.log($('.comment-inpost-nickname').val())
      }
      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("shop-allcontainer").style.height = allheight + "px";
        document.getElementById("shop-body-con").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.shop.building.ch_name + $scope.shop.ch_name;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("shop-allcontainer").style.height = allheight + "px";
        document.getElementById("shop-body-con").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("shop-allcontainer").style.height = allheight + "px";
        document.getElementById("shop-body-con").style.height = allheight + "px";
      });
    }
  ]);