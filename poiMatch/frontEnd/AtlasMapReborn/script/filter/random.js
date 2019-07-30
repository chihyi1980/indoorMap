'use strict';

angular.module('atlas')
	.filter('random', ['Localstorage', function(Localstorage) {
		return function(randomcolor) {
			var ncolor = Math.floor(Math.random() * randomcolor.length + 1) - 1;
			return randomcolor[ncolor];
		};
	}]);