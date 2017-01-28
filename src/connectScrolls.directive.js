'use strict';

function ConnectScrolls (utils, kineticEngine) {
    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        transclude: true,
        replace: true,
        template: '<span data-name="conntect-scroll" ng-transclude></span>',
        link: function (scope, element) {
            scope.hasTouch = 'ontouchstart' in window;
            scope.DETECT_EVT = scope.hasTouch ? 'touchstart' : 'mouseover';
            scope.activeId = undefined;
            scope.$listener = element[0];

            scope.scrollLeft = 0;
            scope.scrollTop = 0;
            scope.lastScrollLeft = 0;
            scope.lastScrollTop = 0;
            scope.targetTop = 0;
            scope.targetLeft = 0;

            scope.velocityTop = 0;
            scope.velocityLeft = 0;
            scope.amplitudeTop = 0;
            scope.amplitudeLeft = 0;

            scope.timeStamp = 0;
            scope.referenceX = 0;
            scope.referenceY = 0;
            scope.pressed = false;
            scope.autoScrollTracker = null;
            scope.isAutoScrolling = false;

            scope.defaultOptions = {
                enableKinetics: false,
                movingAverage: 0.1
            };
            scope.userOptions = angular.extend({}, scope.defaultOptions, scope.options);

            kineticEngine.call(this, scope, utils);

            scope.setActiveNode = function (e) {
                scope.activeId = utils.findMatchingTarget(e.target, scope.childNodes);
            }

            scope.onScroll = function (e) {
                if ( this.pressed || this.isAutoScrolling ) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                var target = e.target;
                var valX = undefined;
                var valY = undefined;

                if ( target.clientWidth !== target.scrollWidth ) {
                    valX = target.scrollLeft;
                    scope.lastScrollLeft = scope.scrollLeft;
                    scope.scrollLeft = valX;
                } else {
                    valX = scope.scrollLeft;
                }
                if ( target.clientHeight !== target.scrollHeight ) {
                    valY = target.scrollTop;
                    scope.lastScrollTop = scope.scrollTop;
                    scope.scrollTop = valY;
                } else {
                    valY = scope.scrollTop;
                }

                scope.childNodes.forEach(function(node) {
                    if ( node.id !== scope.activeId ) {
                        node.children[0].scrollLeft = valX;
                        node.children[0].scrollTop = valY;
                    }
                });
            }

            scope.$listener.addEventListener( scope.DETECT_EVT, scope.setActiveNode, true );
            scope.$listener.addEventListener( 'scroll', scope.onScroll, true );

            scope.$on('$destroy', function() {
                scope.$listener.removeEventListener( scope.DETECT_EVT, scope.setActiveNode );
                scope.$listener.removeEventListener( 'scroll', scope.onScroll );
            });

            // expose few methods to the parent controller
            scope.$parent.connectedScrolls = {
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
        },
        controller: ['$scope', function connectScrollsCtrl($scope) {
            var childNodes = $scope.childNodes = [];

            this.addScrollArea = function (node) {
                childNodes.push(node);
            }
        }]
    }
}

ConnectScrolls.$inject = ['utils', 'kineticEngine'];

module.exports = ConnectScrolls;
