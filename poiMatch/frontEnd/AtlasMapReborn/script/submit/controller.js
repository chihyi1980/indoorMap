'use strict';

angular
  .module('atlas')
  .controller('submitCtrl', ['$scope', 'global', 'Localstorage', '$route', '$http', '$timeout',
    function($scope, global, Localstorage, $route, $http, $timeout) {
      $scope.postcomment = function() {

        $scope.thisuid = null;
        if (!global.uid) {
          global.uid = $route.current.params.uid;
          $scope.thisuid = global.uid;
        };
        var spid = $route.current.params.sid;
        var cityId = $route.current.params.cityid;
        console.log(spid);
        $scope.showNotice = false;

        function showNotice(content) {
          $scope.noticeContent = content;
          $scope.showNotice = true;
          $timeout(function() {
            $scope.showNotice = false;
          }, 1000);
        }
        if ($scope.userComment) {
          $http({
              method: 'POST',
              url: 'http://ap.atlasyun.com/api_test/comment/' + cityId,
              data: serializeData({
                poi_id: spid,
                user_nickname: '匿名用户',
                text_excerpt: $scope.userComment,
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .success(function(data) {
              window.parent.location.href = '#/shop/' + cityId + '/' + spid;
              var content = "发布成功";
              showNotice(content);
            });
        } else {}
      };

      function serializeData(data) {
        if (!angular.isObject(data)) {
          return ((data == null) ? "" : data.toString());
        }

        var buffer = [];

        for (var name in data) {
          if (!data.hasOwnProperty(name)) {
            continue;
          }

          var value = data[name];

          buffer.push(
            encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value)
          );
        }

        var source = buffer.join("&").replace(/%20/g, "+");
        return (source);
      }
    }
  ]);