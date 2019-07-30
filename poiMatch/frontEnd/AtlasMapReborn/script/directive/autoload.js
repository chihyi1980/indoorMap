'use strict';
angular.module('atlas')
	.directive('whenScrolled', function() {
		return function(scope, elm, attr) {
			console.log(4);
			var raw = elm[0];
			// var isLock = attr.isLock;

			elm.bind('scroll', function() {
				console.log(0);
				if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
					scope.$apply(attr.whenScrolled);
				}
			});
		};
	});