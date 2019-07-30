'use strict';

angular.module('atlas')
	.filter('commenttime', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
		return function(time) {
			return time.substr(0, 10);
		};
	}]);