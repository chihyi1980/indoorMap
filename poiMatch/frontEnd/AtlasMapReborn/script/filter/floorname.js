'use strict';

angular.module('atlas')
    .filter('floorname', ['Localstorage', function(Localstorage) {
        return function(floor) {
            if (floor.match(/B/) || floor.match(/b/)) {
                var num = floor.replace(/[^0-9]/ig, "");
                return "负" + num + "楼";
            } else if (floor.match(/L/) || floor.match(/l/)) {
                var num = floor.replace(/[^0-9]/ig, "");
                return num + "楼";
            }
            return floor.replace('f', '楼').replace('F', '楼');
        };
    }]);