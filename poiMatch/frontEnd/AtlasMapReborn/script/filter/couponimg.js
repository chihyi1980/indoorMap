'use strict';

angular.module('atlas')
	.filter('couponimg', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
		return function(type) {
			if (type == '大众点评') {
				return './img/logo-dzdp.png';
			} else return './img/default-couponlogo.png';
		};
	}]);