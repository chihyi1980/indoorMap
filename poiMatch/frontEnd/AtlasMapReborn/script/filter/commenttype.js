'use strict';

angular.module('atlas')
    .filter('commenttype', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(type) {
            switch (type) {
                case 1:
                    return '大众点评';
                case 2:
                    return '美团';
                case 3:
                    return '糯米';
                case 4:
                    return 'Atlas';
            }
        };
    }]);