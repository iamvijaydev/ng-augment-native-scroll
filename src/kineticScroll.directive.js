'use strict';

function KineticScroll (utils, kineticEngine) {
    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        transclude: true,
        replace: true,
        template: '<span data-name="kinetic-scroll" ng-transclude></span>',
        link: function (scope, element) {
            scope.hasTouch = 'ontouchstart' in window;
            scope.DETECT_EVT = scope.hasTouch ? 'touchstart' : 'mouseover';
            scope.$listener = element[0];
            scope.childNodes = [ scope.$listener ];

            scope.defaultOptions = {
                enableKinetics: false,
                movingAverage: 0.1
            };
            scope.userOptions = angular.extend({}, scope.defaultOptions, scope.options);

            kineticEngine.call(this, scope, utils);

            // expose few methods to the parent controller
            scope.$parent.kineticScroll = {
                scrollToStart: function () {
                    scope.cancelAutoScroll();
                    scope.scrollTo(0, 0);
                },
                scrollToStartLeft: function () {
                    scope.cancelAutoScroll();
                    scope.scrollTo(0, scope.scrollTop);
                },
                scrollToStartTop: function () {
                    scope.cancelAutoScroll();
                    scope.scrollTo(scope.scrollLeft, 0);
                },
                scrollToEnd: function () {
                    var maxScrollLeft = 0;
                    var maxScrollTop = 0;

                    scope.childNodes.forEach(function (node) {
                        var $el = node.children[0];
                        var maxScrollX = $el.scrollWidth - $el.clientWidth;
                        var maxScrollY = $el.scrollHeight - $el.clientHeight;

                        if ( maxScrollX > maxScrollLeft ) {
                            maxScrollLeft = maxScrollX;
                        }
                        if ( maxScrollY > maxScrollTop ) {
                            maxScrollTop = maxScrollY;
                        }
                    });

                    scope.cancelAutoScroll();
                    scope.scrollTo(maxScrollLeft, maxScrollTop);
                },
                scrollToEndLeft: function () {
                    var maxScrollLeft = 0;

                    scope.childNodes.forEach(function (node) {
                        var $el = node.children[0];
                        var maxScrollX = $el.scrollWidth - $el.clientWidth;

                        if ( maxScrollX > maxScrollLeft ) {
                            maxScrollLeft = maxScrollX;
                        }
                    });

                    scope.cancelAutoScroll();
                    scope.scrollTo(maxScrollLeft, scope.scrollTop);
                },
                scrollToEndTop: function () {
                    var maxScrollTop = 0;

                    scope.childNodes.forEach(function (node) {
                        var $el = node.children[0];
                        var maxScrollY = $el.scrollHeight - $el.clientHeight;

                        if ( maxScrollY > maxScrollTop ) {
                            maxScrollTop = maxScrollY;
                        }
                    });

                    scope.cancelAutoScroll();
                    scope.scrollTo(scope.scrollLeft, maxScrollTop);
                }
            }
        }
    }
}

KineticScroll.$inject = ['utils', 'kineticEngine'];

module.exports = KineticScroll;
