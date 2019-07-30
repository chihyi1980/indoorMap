'use strict';

angular
  .module('atlas')
  .controller('homeCtrl', ['$scope', 'API_PREFIX', 'wxCollect', '$http', '$timeout', 'CityList', 'IMAGE_PREFIX', '$routeParams', 'Hotkey', 'malls', 'Search', 'Localstorage', '$location', '$filter', 'Brand', 'Districts', '$window', '$anchorScroll', 'Subway', '$route','global',
    function($scope, API_PREFIX, wxCollect, $http, $timeout, CityList, IMAGE_PREFIX, $routeParams, Hotkey, malls, Search, Localstorage, $location, $filter, Brand, Districts, $window, $anchorScroll, Subway, $route,global) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.showiconnotice = false;
      var gps = $filter('gps');
      for (var i in malls) {
        malls[i].location = gps(malls[i].loc);
      }

      $scope.cityId = $route.current.params.cityid;

      $scope.toogleLikeBuilding = function(building) {

        if ($route.current.params.uid) {
          if (building.likeImg === './img/icon-heart-whitebuilding.png') {
            var data = {
              poi_id: building.poi_id,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid + '/' + building.poi_id,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };
        } else {
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };

          var storeBuilding = {};
          storeBuilding.id = building.poi_id;
          storeBuilding.ch_name = building.ch_name;
          storeBuilding.img = building.buildings[0].pics[0].key;
          storeBuilding.cityid = $route.current.params.cityid;
          Localstorage.toogleLikeBuilding(storeBuilding);
        }
      };

      $scope.toogleLikeBuildingLike = function(building) {
        if ($route.current.params.uid) {
          if (building.likeImg === './img/icon-heart-whitebuilding.png') {
            var data = {
              poi_id: building.poi_id,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/malls/' + $route.current.params.uid + '/' + building.poi_id,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };
          for (var i = $scope.likeMalls.length - 1; i >= 0; i--) {
            if ($scope.likeMalls[i].poi_id === building.poi_id) {
              if ($scope.likeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.likeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.likeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            }
          };
        } else {
          for (var i = $scope.unLikeMalls.length - 1; i >= 0; i--) {
            if ($scope.unLikeMalls[i].poi_id === building.poi_id) {
              if ($scope.unLikeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.unLikeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            };
          };
          for (var i = $scope.likeMalls.length - 1; i >= 0; i--) {
            if ($scope.likeMalls[i].poi_id === building.poi_id) {
              if ($scope.likeMalls[i].likeImg === './img/icon-heart-redbuilding.png') {
                $scope.likeMalls[i].likeImg = './img/icon-heart-whitebuilding.png';
              } else {
                $scope.likeMalls[i].likeImg = './img/icon-heart-redbuilding.png';
              }
            }
          };
        };

        var storeBuilding = {};
        storeBuilding.id = building.poi_id;
        storeBuilding.ch_name = building.ch_name;
        storeBuilding.img = building.buildings[0].pics[0].key;
        storeBuilding.cityid = $route.current.params.cityid;
        Localstorage.toogleLikeBuilding(storeBuilding);
      };

      //排序算法
      function sortMall(mallArr) {
        if (!mallArr.length) {
          return [];
        }
        for (var i in mallArr) {
          //不需要排序的情况
          if (!mallArr[i].location || mallArr[i].location === '--') {
            return mallArr;
          }
          mallArr = mallArr.sort(function(a, b) {
            return a.location * 1 - b.location * 1;
          });
          return mallArr;
        }
      }

      $scope.likeShop = Localstorage.getLike().shops;
      $scope.likeBuilding = Localstorage.getLike().buildings;
      // console.log($scope.likeShop);
      // console.log($scope.likeBuilding);
      if (isEmpty($scope.likeBuilding)) {
        $scope.IsLikeBuildingEmpty = true;
      } else {
        $scope.IsLikeBuildingEmpty = false;
      }
      if (isEmpty($scope.likeShop)) {
        $scope.IsLikeShopEmpty = true;
      } else {
        $scope.IsLikeShopEmpty = false;
      }

      $scope.homesearchgomap = function(mallid, buildingid, floorid, shopid) {
        $location.path('/map/' + mallid + '&' + buildingid + '/' + floorid + '/' + shopid);
      }
      $scope.homesearchgoshop = function(shopid) {
        $location.path('/shop/' + $scope.cityId + '/' + shopid);
      }

      // console.log(wxCollect)
      function getMallIds(malls){
        var likeBd = {};
        malls.forEach(function(mall){
          likeBd[mall.poi_id] = mall;
        });
        return likeBd;
      }

      function getSortMall(malls, Localstorage) {
        var likeBd;
        if (!wxCollect) {
          likeBd = Localstorage.getLike().buildings;
        } else {
          likeBd = getMallIds(wxCollect.data.malls);
        }
        // console.log(Localstorage.getLike().buildings)
        // console.log(likeBd)
         
          var unSortMalls = malls,
          likeMalls = [],
          unLikeMalls = [],
          sortedMall;

        if (!Object.keys(likeBd).length) {
          return {
            likeMalls: sortMall(likeMalls),
            unLikeMalls: sortMall(malls),
            sortedMall: sortMall(malls)
          };
        }

        for (var i in unSortMalls) {
          if (unSortMalls[i].poi_id in likeBd) {
            likeMalls.push(unSortMalls[i]);
          } else {
            unLikeMalls.push(unSortMalls[i]);
          }
        }

        if (!likeMalls.length || !unLikeMalls.length) {
          return {
            likeMalls: sortMall(likeMalls),
            unLikeMalls: sortMall(unLikeMalls),
            sortedMall: sortMall(malls)
          };
        }

        likeMalls = sortMall(likeMalls);
        unLikeMalls = sortMall(unLikeMalls);
        sortedMall = likeMalls.concat(unLikeMalls);
        return {
          likeMalls: likeMalls,
          unLikeMalls: unLikeMalls,
          sortedMall: sortedMall
        };
      }

      Hotkey.fetch().then(function(hotkey) {
        $scope.hotkey = hotkey.data.keys;
        // console.log($scope.hotkey);
      });

      Brand.fetch().then(function(brand) {
        $scope.brand = brand.data;
        // console.log($scope.brand);
      });

      // console.log($scope.WxCollect.malls);

      Subway.fetch($scope.cityId).then(function(subway) {
        $scope.subway = subway.data;
        for (i in $scope.subway) {
          $scope.subway[i].num = $scope.subway[i]._id.replace(/[^0-9]/ig, "");
        }
        // console.log($scope.subway);

        function sortSubway(mallArr) {
          if (!mallArr.length) {
            return [];
          }
          for (var i in mallArr) {
            mallArr = mallArr.sort(function(a, b) {
              return a.num - b.num;
            });
            return mallArr;
          }
        }
        for (var i in $scope.subway) {
          var sortedShop;
          $scope.sortedShop = sortSubway($scope.subway);
        }
      });

      $scope.showMore = false;
      var sortMall = getSortMall(malls, Localstorage);
      $scope.likeMalls = sortMall.likeMalls;
      $scope.unLikeMalls = sortMall.unLikeMalls;
      $scope.unLikeMalls.forEach(function(unLikeMall) {
        unLikeMall.likeImg = './img/icon-heart-whitebuilding.png';
      });

      $scope.likeMalls.forEach(function(likeMall) {
        likeMall.likeImg = './img/icon-heart-redbuilding.png';
      });
      $scope.gotoMall = function(poi_id) {
        hashmall(poi_id);
        $timeout(function() {
          document.getElementById("content").scrollTop = document.getElementById("content").scrollTop - 50;
        }, 500);
      }

      function hashmall(poi_id) {
        var old = $location.hash();
        $location.hash(poi_id);

        $anchorScroll();
        $location.hash(old);
        for (var i in $scope.unLikeMalls) {
          if ($scope.unLikeMalls[i].poi_id === poi_id) {
            $scope.unLikeMalls[i].isOpen = true;
          };
        }
        snapper.close();
      }
      // console.log($scope.unLikeMalls);

      $scope.sortedMall = sortMall.sortedMall;

      $scope.homeLeftPath = '/partials/slider/home-profile.html';
      $scope.enterCollect = function() {
        $scope.like = Localstorage.getLike();
        // console.log($scope.like);
      };
      $scope.showHistory = false;
      $scope.search = function(kword) {
        var keyword = kword;
        if (keyword) {
          // var searchhis = Localstorage.getSearchHis();
          // searchhis.push(keyword);
          // searchhis = searchhis.slice(-10);
          // Localstorage.setSearchHis(searchhis);
          $location.path('/search/' + $scope.cityId + '/' + keyword + '/1');
        }
      };
      $scope.entersearch = function(event, keyword) {
        if (event.keyCode === 13) {
          $scope.search(keyword.toLowerCase());
        }
      }
      $scope.loadMore = function() {
        // console.log(1);
      };

      $scope.showcollect = true;
      $scope.toggleCollect = function() {
        $scope.showcollect = !$scope.showcollect;
        $scope.like = Localstorage.getLike();
        $scope.likeLength = {};
        $scope.likeLength.buildings = Object.keys($scope.like.buildings).length;
        $scope.likeLength.shops = Object.keys($scope.like.shops).length;
      };

      $scope.removeSerachHis = function() {
        Localstorage.removeSearchHis();
        $scope.showSeachHis = [];
      };

      $scope.showSeachHis = Localstorage.getSearchHis().reverse();

      for (var i in $scope.likeMalls) {
        $scope.likeMalls[i].isOpen = false;
      }
      $scope.changelikeCardOpen = function(index) {
        $scope.likeMalls[index].isOpen = !$scope.likeMalls[index].isOpen;
      };

      for (var i in $scope.unLikeMalls) {
        $scope.unLikeMalls[i].isOpen = false;
      }

      $scope.changeCardOpen = function(index) {
        $scope.unLikeMalls[index].isOpen = !$scope.unLikeMalls[index].isOpen;
      };

      for (var i in $scope.brand) {
        $scope.brand[i].isOpen = false;
      }
      $scope.changeOpen = function(index) {
        $scope.brand[index].isOpen = !$scope.brand[index].isOpen;
      };

      for (var i in $scope.subway) {
        $scope.subway[i].isOpen = false;
      }
      $scope.changeSubOpen = function(index) {
        $scope.subway[index].isOpen = !$scope.subway[index].isOpen;
      };

      for (var i in $scope.districts) {
        $scope.districts[i].isOpen = false;
      }
      $scope.changeDisOpen = function(index) {
        $scope.districts[index].isOpen = !$scope.districts[index].isOpen;
      };

      $scope.changeTag = function(tag) {
        $scope.tag = tag;
      }

      $scope.searchBuildings = malls;
      $scope.searchShops = [];
      $scope.tag = 'mall';

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        document.getElementById("right-drawer").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通");
        CityList.fetch().then(function(citylist) {
          $scope.citylist = citylist.data;
          // console.log($scope.citylist);
          for (var i in $scope.citylist) {
            // console.log($scope.citylist[i]._id);
            if ($scope.citylist[i]._id === $scope.cityId) {
              $scope.CityName = $scope.citylist[i].name;
              // console.log($scope.CityName);
            }
          }
        });
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        document.getElementById("right-drawer").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        document.getElementById("right-drawer").style.height = allheight + "px";
      });
      angular.element(document).ready(function() {
        var mallid = $route.current.params.mallid;
        hashmall(mallid);
      });

      var addEvent = function addEvent(element, eventName, func) {
        if (element.addEventListener) {
          return element.addEventListener(eventName, func, false);
        } else if (element.attachEvent) {
          return element.attachEvent("on" + eventName, func);
        }
      };
      var snapper = new Snap({
        element: document.getElementById('map-body'),
        maxPosition: 265,
        minPosition: -265,
        disable: 'left'
      });
      addEvent(document.getElementById('showRightPush'), 'click', function() {
        if (snapper.state().state == "right") {
          snapper.close();
        } else {
          snapper.open('right');
        }
      });

      function isEmpty(obj) {
        for (var name in obj) {
          return false;
        }
        return true;
      };
    }
  ]);