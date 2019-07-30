'use strict';

angular.module('atlas')
    .filter('logo', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(url) {
            if (url) {
                return IMAGE_PREFIX + url + '?imageView/2/w/100/h/100';
            } else {
                return './img/shop.png';
            }
        };
    }]);