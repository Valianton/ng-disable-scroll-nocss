(function(factory) {

  var ngModule = factory(this.angular);

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = ngModule;
  }

})(function(angular){
  'use strict';

  return angular.module('ngDisableScrollNocss', [])

    .directive('ngDisableScroll', ['$window', '$document', disableScroll]);

    function disableScroll ($window, $document) {

      return {

        restrict: 'A',

        link: function($scope, $element, $attrs) {

          var currentScrollY = null;

          var keys = {37: 1, 38: 1, 39: 1, 40: 1};

          var eventsListening = 'DOMMouseScroll wheel mousewheel touchmove keydown';

          var isListening = false;

          $scope.$watch($attrs.ngDisableScroll, function(shouldDisable) {

            if (shouldDisable) {

              disableScroll();

            } else {

              if (isListening) {
                unbindHandler();
              }
            }
          });

          $scope.$on('$destroy', unbindHandler);

          function scrollHandler(event) {

            event = event || $window.event;

            var isScrollAllowed = scrollAllowed(event);

            if (!isScrollAllowed) {
              event.returnValue = false;
              event.preventDefault();
            }

            // Also prevent scroll of main window
            $window.onscroll = function () {
              $window.scrollTo(0, currentScrollY);
            }
          }

          function preventDefaultForScrollKeys(event) {

            if (keys[event.keyCode]) {

              scrollHandler(event);

              return false;
            }
          }

          function disableScroll() {
            currentScrollY = $window.scrollY;
            $document.bind(eventsListening, scrollHandler);
            isListening = true;
          }

          function unbindHandler() {
            $document.unbind(eventsListening, scrollHandler);
            $window.onscroll = null;
            isListening = false;
          }

          function scrollAllowed(event) {

            var selector = $attrs.scrollableElements;

            if (!selector) {
              return canScroll(event, $element[0]);
            }
            var predicate = canScroll.bind(null, event);
            return scrollableNodes(selector).some(predicate);
          }

          function canScroll(event, scrollable) {
            return scrollable.contains(event.target) &&
              scrollable.scrollHeight > scrollable.clientHeight;
          }

          function scrollableNodes(selector) {
            var nodes = $element[0].querySelectorAll(selector);
            return Array.prototype.slice.apply(nodes);
          }
        }
      };
    }
});
