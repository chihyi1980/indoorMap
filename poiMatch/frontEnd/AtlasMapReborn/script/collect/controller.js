'use strict';

angular
	.module('atlas')
	.controller('collectCtr', ['$scope', 'Localstorage', '$window',
		function($scope, Localstorage, $window) {
			$scope.like = Localstorage.getLike();
			
			$scope.$on('$viewContentLoaded', function() {
				var allheight = document.body.offsetHeight;
				document.getElementById("content").style.height = allheight + "px";
				$window.document.title = "我的收藏";
			});
			$scope.$watch('$viewContentLoaded', function() {
				var allheight = document.body.offsetHeight;
				document.getElementById("content").style.height = allheight + "px";
			});
			window.addEventListener("resize", function() {
				var allheight = document.body.offsetHeight;
				document.getElementById("content").style.height = allheight + "px";
			});
		}
	]);