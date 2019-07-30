'use strict';

angular.module('atlas')
    .filter('cityName', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(cityid) {
            if (cityid == '54a0c5430a2313755106951c') {
                return '北京';
            } else {
                return '上海';
            }
        };
    }]);