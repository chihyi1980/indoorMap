'use strict';

angular.module('atlas')
	.filter('sortMall', ['Localstorage', function(Localstorage) {
		return function(malls) {
			return malls;
		};
	}]);