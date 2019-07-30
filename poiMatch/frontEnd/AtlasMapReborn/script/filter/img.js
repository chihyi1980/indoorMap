'use strict';

angular.module('atlas')
    .filter('img', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(url) {
            if (url) {
                return IMAGE_PREFIX + url + '?imageView/2/w/480';
            } else {
                return './img/1.jpg';
            }
        };
    }]);