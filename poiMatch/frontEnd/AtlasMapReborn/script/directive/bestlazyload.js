angular.module('atlas').directive(
  'imageLazySrc',
  function($document, $window) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attributes) {

        function isInView() {
          var clientHeight = $document[0].documentElement.clientHeight,
            clientWidth = $document[0].documentElement.clientWidth,
            imageRect = $element[0].getBoundingClientRect();
          if (
            (imageRect.top >= 0 && imageRect.bottom <= clientHeight) &&
            (imageRect.left >= 0 && imageRect.right <= clientWidth)
          ) {
            $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)

            removeEventListeners();
          }
        }

        function removeEventListeners() {
          document.getElementById('content').removeEventListener('scroll', isInView);
        }

        document.getElementById('content').addEventListener('scroll', isInView);

        $element.on('$destroy', function() {
          removeEventListeners();
        });
        isInView();

      }
    };
  }
);