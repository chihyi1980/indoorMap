'use strict';

angular.module('atlas')
  .filter('turnbuilding', ['DEFAULT_CITY_ID', '$http', '$q',
    function(DEFAULT_CITY_ID, $http, $q) {
      return function(bpid) {
        // if(bpid){
        // 	return IMAGE_PREFIX + bpid +'?imageView/2/w/480';
        // }
        //    else{
        //    	return './img/1.jpg';
        //    }
        // var url = 'http://ap.atlasyun.com/api/mall/pid/' + bpid + '/' + DEFAULT_CITY_ID + '?callback=JSON_CALLBACK';
        //          return $http.jsonp(url).success(function(data) {
        //              return data;
        //          });
        //      console.log(data);
        // $scope.getbname = function(bpoid){
        //   var url = 'http://ap.atlasyun.com/api/mall/pid/' + bpid + '/' + DEFAULT_CITY_ID + '?callback=JSON_CALLBACK';
        //   return $http.jsonp(url).success(function(data) {
        //       return data;
        //   });
        //   console.log(data);
        // }
        return 1;
      };
    }
  ]);