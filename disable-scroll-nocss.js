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

          var element = $element[0];

          var touchStart = 0;
          var touchMove = 0;

          var deltaY = 0;

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


            if (element.scrollTop + element.offsetHeight >= element.scrollHeight && (event.deltaY > 0 || deltaY > 0))
            {
              isScrollAllowed = false;
            }

            if (element.scrollTop == 0 && (event.deltaY < 0 || deltaY < 0))
            {
              isScrollAllowed = false;
            }

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

            if (event.target.type === 'text') {
              return true;
            }

            if (keys[event.keyCode]) {
              return false;
            }

            return true;
          }

          function disableScroll() {
            currentScrollY = $window.scrollY;
            $document.bind(eventsListening, scrollHandler);
            isListening = true;

             $document.bind('touchstart', getTouchStart);
             $document.bind('touchmove', getTouchMove);
          }

          function getTouchStart(event) {
            touchStart = event.touches[0].clientY;
          }

          function getTouchMove(event) {
            touchMove = event.touches[0].clientY;
            deltaY = touchMove < touchStart ? 1 : -1;
            console.log(deltaY);
          }

          function unbindHandler() {
            $document.unbind(eventsListening, scrollHandler);
            $window.onscroll = null;
            isListening = false;
          }

          function scrollAllowed(event) {

            if (event.type === 'keydown') {

              return preventDefaultForScrollKeys(event);
            }

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
